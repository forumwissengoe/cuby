import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[slidesController]'
})
export class SlidesControllerDirective {

  	constructor(private el: ElementRef)
	{
		console.log("Directive element: ", el);
	}

}
