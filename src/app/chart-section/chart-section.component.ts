import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chart-section',
  templateUrl: './chart-section.component.html',
  styleUrls: ['./chart-section.component.css']
})
export class ChartSectionComponent implements OnInit {
  totalStoreVisitsData: any = [];
  finalSturcturedData: any;
  headerList: any[] = [];
  selectionList: any[] = [];
  selectedStoreVisitsData: any[] = [];
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient.get('assets/test.json').subscribe(data => {
      console.log(data);
      this.totalStoreVisitsData = data;
      let sortedObj = this.groupBy(this.totalStoreVisitsData.outer_attribute.brands , 'Vertical');
      this.sortObj(sortedObj);
      this.percentageCalculate(sortedObj);
      this.finalSturcturedData = sortedObj;
      this.headerList = Object.keys(this.finalSturcturedData);
      this.selectionList = Object.keys(this.finalSturcturedData);
      this.selectedStoreVisitsData = this.finalSturcturedData[this.selectionList[0]];
    });
  }

  groupBy(ObjArr, property) {
    return ObjArr.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(obj);
      return acc;
    }, {});
  }

  sortObj(obj) {
    // tslint:disable-next-line: forin
    for (const i in obj) {
     obj[i] = obj[i].sort((a,b) => {
        return b.customer_visit_ratio - a.customer_visit_ratio;
      });
    }

  }

  // tslint:disable-next-line: typedef
  percentageCalculate(Obj) {
    let max;
    // tslint:disable-next-line: forin
    for (const key in Obj) {
      max = Obj[key][0].customer_visit_ratio;
      Obj[key] = Obj[key].map((a) => {
        a.percentage = a.customer_visit_ratio / max * 100;
        a.color = 'Green';
        a.status = 'High';
        if (a.percentage < 75 && a.percentage >= 25) {
          a.status = 'Med';
          a.color = 'Orange';
        }
        else if (a.percentage < 25) {
          a.color = 'Red';
          a.status = 'Low';
        }
        return a;
      })
    }
  }

  selectStoreVisists(event){
    this.selectedStoreVisitsData = [];
    this.selectedStoreVisitsData = this.finalSturcturedData[event.currentTarget.value];
  }

}
