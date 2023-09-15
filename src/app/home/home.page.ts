import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  step: number = 1;
  rep = {
    1: { 'rep': '' },
    2: { 'rep': '' },
    3: { 'rep': '' },
  }
  imgsrc: string = 'https://cards.scryfall.io/art_crop/front/d/b/db113c47-c403-4c7f-9fa9-212c977df8d1.jpg?1626093205'
  constructor() { }


  async fnext() {
    if (this.step === 1 || this.check()) {
      await this.changeImg()
      this.step++;
    }
    console.log(this.step);
    console.log('repinses',this.rep);
    
  }
  SelectRep(e: any) {
    this.rep[this.step - 1 as keyof typeof this.rep].rep = e.target.value
  }
  check(): boolean {
    return this.rep[this.step - 1 as keyof typeof this.rep].rep !== ''
  }
  async fprev() {
    await this.changeImg()
    this.step--;

    console.log(this.step);

  }
  gotofasteleads() {
    window.location.href = "https://f.nxp.lk";

  }
  async changeImg() {
    let rep = await fetch('https://api.scryfall.com/cards/random')
    let json = await rep.json()
    if (json.image_uris) {
      this.imgsrc = json.image_uris.art_crop
    } else {
      this.imgsrc = json.card_faces[0].image_uris?.art_crop
    }
  }
}
