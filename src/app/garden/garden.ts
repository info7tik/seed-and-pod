import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderMenu } from '../header-menu/header-menu';

@Component({
  selector: 'app-garden',
  imports: [HeaderMenu, FormsModule],
  templateUrl: './garden.html',
  styleUrl: './garden.scss'
})
export class Garden implements OnInit {
  numberOfBeds: number = 1;
  private readonly BEDS_KEY = 'garden-number-of-beds';

  ngOnInit(): void {
    const savedBeds = localStorage.getItem(this.BEDS_KEY);
    if (savedBeds) {
      this.numberOfBeds = parseInt(savedBeds, 10) || 1;
    }
  }

  updateNumberOfBeds(): void {
    // Ensure minimum of 1 bed
    if (this.numberOfBeds < 1) {
      this.numberOfBeds = 1;
    }

    // Save to localStorage
    localStorage.setItem(this.BEDS_KEY, this.numberOfBeds.toString());
  }
}
