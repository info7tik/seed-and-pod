import { Component, Input, OnInit } from '@angular/core';
import { YearService } from '../service/year.service';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-year-selector',
  imports: [FormsModule, TranslocoPipe],
  templateUrl: './year-selector.component.html',
  styleUrl: './year-selector.component.scss'
})
export class YearSelectorComponent implements OnInit {
  @Input({ required: true }) reloadData!: () => void;

  selectedYear: number = 0;
  years: number[] = [];

  constructor(private yearService: YearService) { }
  ngOnInit(): void {
    this.years = this.yearService.getYears();
    this.selectedYear = this.yearService.getSelectedYear();
  }

  changeYear() {
    this.yearService.saveSelectedYear(this.selectedYear);
    this.reloadData();
  }
}
