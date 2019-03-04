import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {iiiFData} from '../../../data/iiiFData';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
    
    public static iiiF_baselink:string = "https://sammlungen.uni-goettingen.de/rest/iiif/manifests/";
    
    @ViewChild('overlay') overlay: ElementRef;
    
    
    current_number:number = 0;
    total_number:number = 0;

    current_image:string = "http://www.adweek.com/files/2015_May/iStock-Unfinished-Business-6.jpg";
    
    slideOpts:any = {
        effect: 'flip'
        
    };

    images:any = [];

    constructor(private renderer: Renderer2)
    {
        let links = ["record_kuniweb_945664", "record_kuniweb_666297", "record_kuniweb_943917", "record_kuniweb_681925", "record_kuniweb_854325"];
        let self = this;
        
        for(let i = 0; i < links.length; i++)
        {
            let xhr:XMLHttpRequest = new XMLHttpRequest();
            xhr.open("GET", DetailsPage.iiiF_baselink + links[i] + "/manifest");
            xhr.onload = function(ev) {
                if(xhr.readyState === 4)
                {
                    if(xhr.status === 200)
                    {
                        let manifest = JSON.parse(xhr.responseText.replace(/@/g, ""));
                        self.images.push(DetailsPage.crunshManifest(manifest));
                    }
                    else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.send();
        }
    }
    
    ngOnInit() {
    
    }

    static crunshManifest(manifest:any)
    {
        const name  = manifest.label;
        const image = manifest.thumbnail.service.id + "/full/!400,400/0/default.jpg";
        const metadata = iiiFData.compactifyIIIFmetadata(manifest.metadata);
        
        let location = "";
        let date = "";
        let persons = "";
        let size = "";
        
        for(let m of metadata)
        {
            if(m.label === "Name des Standorts")
                location = m.value;
            else if(m.label === "Datierung")
                date = m.value;
            else if(m.label === "Beteiligte Personen / Institutionen")
                persons = m.value;
            else if(m.label === "Maße / Umfang")
                size = m.value;
        }
        
        return {name: name, image: image, location: location, date: date, persons: persons, size: size};
    }
    
    accept(ev:any): any
    {
        console.log("ACCEPT: ", ev);
    }
    
    decline(ev:any): any
    {
        console.log("DECLINE: ", ev);
    }
    
    overlayClosed()
    {
        this.renderer.removeClass(this.overlay.nativeElement, "shown");
    }
    
    overlayOpen(img:any)
    {
        this.renderer.addClass(this.overlay.nativeElement, "shown");
        this.current_image = img.image;
        console.log("IMG", img);
    }
}
