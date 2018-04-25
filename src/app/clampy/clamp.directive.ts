import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
  SecurityContext,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as clampy_ from '@clampy-js/clampy/dist/clampy.umd.js';
import * as elementResizeDetectorMaker_ from 'element-resize-detector';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';

// https://github.com/rollup/rollup/issues/670#issuecomment-284621537
const clampy: any = (<any>clampy_).default || clampy_;
const elementResizeDetectorMaker: any =
  (<any>elementResizeDetectorMaker_).default || elementResizeDetectorMaker_;

@Directive({
  selector: '[clampy]'
})
export class ClampDirective implements AfterViewInit, OnChanges, OnDestroy {
  /*
   * This controls where and when to clamp the text of an element.
   * Submitting a number controls the number of lines that should be displayed.
   * Second, you can submit a CSS value (in px or em) that controls the height
   * of the element as a String. Finally, you can submit the word 'auto' as a
   * string. Auto will try to fill up the available space with the content and
   * then automatically clamp once content no longer fits.
   *
   * @type string
   * @memberof ClampDirective
   */
  @Input() public clampy: string;

  /*
     * Sometimes you need to apply an ellipsis on HTML content. The prefered Angular way to usually do this is to bind the
     * HTML content to the innerHTML attribute. However, this directive also modifies the innerHTML property and this may
     * produce unexpected results.
     *
     * To counter this, you can instead bind it to the clampyContent attribute.
     * The content will be automatically sanitized by the directive so that only safe HTML content will be present.
     *
     * @type string
     * @memberof ClampDirective
     */
  @Input() public clampyContent: string;

  /*
   * The character to insert at the end of the HTML element after truncation is
   * performed. This defaults to an ellipsis (…).
   *
   * @type string
   * @memberof ClampDirective
   */
  @Input() public clampyTruncationCharacter: string;

  /*
   * The original content before any ellipsis applied.
   *
   * @type EventEmitter<string>
   * @memberof ClampDirective
   */
  @Output()
  public originalContent: EventEmitter<string> = new EventEmitter<string>();

  private initialContent: string;
  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });
  private element: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {
    this.element = this.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    // We use element-resize-detector to trigger the ellipsis.
    this.resizeDetector.listenTo(this.element, () => {
      this.doClampElement(this.element);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.clampy || changes.clampyContent || changes.clampyTruncationCharacter) {
      this.doClampElement(this.element);
    }
  }

  ngOnDestroy(): void {
    this.resizeDetector.removeAllListeners(this.element);
  }

  private setInitialContent(): void {
    if (isNil(this.initialContent)) {
      if (isNil(this.clampyContent)) {
        this.initialContent = isEmpty(this.element.innerHTML)
          ? undefined
          : this.element.innerHTML.trim();
      } else {
        this.initialContent = this.sanitizer.sanitize(
          SecurityContext.HTML,
          this.clampyContent.trim()
        );
      }
    }
  }

  private doClampElement(element: HTMLElement): void {
    // We use element-resize-detector to trigger the ellipsis.
    // Element-resize-detector adds an inner div to monitor
    // it's scroll events.
    // The process of truncating the text for ellipsis removes this div, so we need to remove and readd it
    const scrollNode: Element = this.element.querySelector(
      '.erd_scroll_detection_container'
    );
    if (scrollNode) {
      this.element.removeChild(scrollNode);
    }

    this.element = this.elementRef.nativeElement;
    this.setInitialContent();

    // Set back the element content to the original before clamping.
    // This is necessary when the container grows back.
    if (!isNil(this.initialContent)) {
      this.element.innerHTML = this.initialContent;
      this.clampElement(this.element);
    }

    if (scrollNode) {
      this.element.appendChild(scrollNode);
    }
  }

  private clampElement(element: HTMLElement): void {
    let clampSize = 'auto'; // Default clamp size based on available height
    let truncationChar = '…';

    if (this.clampy) {
      clampSize = this.clampy;
    }

    if (this.clampyTruncationCharacter) {
      truncationChar = this.clampyTruncationCharacter;
    }

    const options = {
      clamp: clampSize,
      truncationChar: truncationChar,
      // Clampy will try to use native clamp if available in the browser
      // however this can leads to unexpected results so we need to explicitely
      // disable it.
      useNativeClamp: false
    };

    // Set the opactity to 0 to avoid content to flick when clamping.
    this.renderer.setStyle(element, 'opacity', 0);
    const result = clampy.clamp(element, options);

    // Set the opacity back to 1 now that the content is clamped.
    this.renderer.setStyle(element, 'opacity', 1);

    if (result.original !== result.clamped) {
      this.originalContent.emit(result.original);
    }
  }
}
