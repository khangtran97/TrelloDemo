import { Component } from '@angular/core';

@Component({
    selector: 'app-test',
    templateUrl: 'test.component.html',
    // styleUrls: ['home.component.css']
})
export class HomeComponent {

    textAreasList:any = [];

    addTextarea() {
        this.textAreasList.push('text_area'+ (this.textAreasList.length + 1));
    }


    removeTextArea(index){
        this.textAreasList.splice(index, 1);
    }

}