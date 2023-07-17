import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild('videoModal') videoModal!: ElementRef;

  constructor(){
    setTimeout(()=>{
      this.showTeaser();
    }, 2000)
  }

  showTeaser(){
    //$("#id-video").css("display", "block");
    const vidModal = this.videoModal.nativeElement;
    vidModal.style.display = "block"

    document.getElementById("backdrop")?.classList.add("active");
  }

  closeVModal(){
    const vidModal = this.videoModal.nativeElement;
    vidModal.style.display = "none"

    document.getElementById("backdrop")?.classList.remove("active");
  }

}
