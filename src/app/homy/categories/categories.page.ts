import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../storage.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

	private dummy:boolean = false;
	private loading:boolean = true;
	
	categoryPairs:CategoriesPair[] = [];
	
  	constructor(private router:Router, private storageService:StorageService)
	{
		if(!this.dummy)
		{
			if(!this.storageService.homyFinished)
				this.storageService.homyCallback = this.categoriesLoaded.bind(this);
			else
				this.categoriesLoaded();
		}
		else
			this.dummyCategories();
	}

  	ngOnInit() {}
	
	categoriesLoaded()
	{
		let x = null;
		for(let cat of this.storageService.configuration.homy_categories)
		{
			if(x == null)
				x = { name: cat.name, id: cat.type, img: cat.cover, url: cat.url, locked: false };
			else
			{
				this.categoryPairs.push({
					a: x,
					b: { name: cat.name, id: cat.type, img: cat.cover, url: cat.url, locked: false }
				});
				x = null;
			}
		}
		if(x != null)
		{
			this.categoryPairs.push({
				a: x,
				b: { name: "", id: "", img: "", url: "", locked: true }
			});
			x = null;
		}
		this.categoryPairs.push({
			a: { name: "", id: "", img: "", url: "", locked: true },
			b: { name: "", id: "", img: "", url: "", locked: true }
		});
		
		for(let p of this.categoryPairs)
		{
			if(p.a.img === "" && !p.a.locked)
				p.a.img = "../../assets/images/blocked.svg";
			if(p.b.img === "" && !p.b.locked)
				p.b.img = "../../assets/images/blocked.svg";
		}
		
		this.loading = false;
	}

	dummyCategories()
	{
		// Dummy
		this.categoryPairs.push({
			a: { name: "Botanik", id: "",  img: "https://sammlungen.uni-goettingen.de/rest/image/record_naniweb_454752/record_naniweb_454752_5968.jpg/square/!400,400/0/default.jpg", url: "", locked: false },
			b: { name: "Kunst", id: "",  img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_594094/record_kuniweb_594094_362862.jpg/square/!400,400/0/default.jpg", url: "", locked: false },
		});
		this.categoryPairs.push({
			a: { name: "Ethnologie", id: "", img: "https://sammlungen.uni-goettingen.de/rest/image/record_kuniweb_948640/record_kuniweb_948640_444883.jpg/square/!400,400/0/default.jpg", url: "", locked: false },
			b: { name: "Geologie", id: "", img: "https://sammlungen.uni-goettingen.de/rest/image/record_naniweb_365739/record_naniweb_365739_2162.jpg/square/!400,400/0/default.jpg", url: "", locked: false }
		});
		this.categoryPairs.push({
			a: { name: "", id: "", img: "", url: "", locked: true},
			b: { name: "", id: "", img: "", url: "", locked: true}
		});
	}
	
	selectCategory(category:{name:string, id:string, img:string, locked:boolean})
	{
		if(category.locked)
			return;
		console.log("Selected: ", category);
		this.router.navigate(['/question', category.id]);
	}
	
	home()
	{
		this.router.navigate(['/homy']);
	}
}

export interface CategoriesPair
{
	a:{name: string, id: string, img: string, url: string, locked: boolean}
	b:{name: string, id: string, img: string, url: string, locked: boolean}
}
