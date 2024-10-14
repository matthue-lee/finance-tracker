import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf and *ngFor
import { FormsModule } from '@angular/forms';  // Import FormsModule

@Component({
  selector: 'app-budget',
  standalone: true,  // Mark the component as standalone
  imports: [CommonModule, FormsModule],  // Import CommonModule to use *ngIf and *ngFor
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements AfterViewInit {
  totalIncome = 1000;  // Initialize with a default total income value
  categories = [
    { name: 'Groceries', value: 30, locked: false, max: 1000 },
    { name: 'Rent', value: 30, locked: false, max: 1000 },
    { name: 'Entertainment', value: 10, locked: false, max: 1000 },
    { name: 'Transport', value: 5, locked: false, max: 1000 },
    { name: 'Utilities', value: 5, locked: false, max: 1000 },
    { name: 'Savings', value: 10, locked: false, max: 1000 },
    { name: 'Dining Out', value: 5, locked: false, max: 1000 },
    { name: 'Miscellaneous', value: 5, locked: false, max: 1000 }
  ];

  totalAllocated = 0;
  remainingBudget = 0;
  isTotalBudgetLocked = false;

  onInputChange(category: any) {
    if (!category.locked) {
      this.updateTotal();
    }if (this.isTotalBudgetLocked) {
      this.adjustUnlockedSliders(category);
    }
  }

  onSliderInput(category: any) {
    if (!category.locked && !this.isTotalBudgetLocked) {
      this.updateTotal();
    }if (this.isTotalBudgetLocked) {
      this.adjustUnlockedSliders(category);
    }
  }

  toggleLock(category: any) {
    category.locked = !category.locked; // Toggle the lock state
    this.updateMaxValues(); // Ensure max values are updated when locking/unlocking
  }

  // Toggle function for locking/unlocking the total budget
  toggleTotalBudgetLock() {
    this.isTotalBudgetLocked = !this.isTotalBudgetLocked;
    this.updateTotal();
    this.updateMaxValues();

  }

  onIncomeChange() {
    this.updateTotal();
    this.updateMaxValues();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateTotal();
      this.updateMaxValues();
    });
  }

  updateTotal() {
    // Calculate the total allocated budget
    this.totalAllocated = this.categories.reduce((acc, category) => acc + category.value, 0);
    this.remainingBudget = this.totalIncome - this.totalAllocated; // Calculate remaining budget
  }

  updateMaxValues() {
    if (this.isTotalBudgetLocked) {
      // Lock sliders: max is total allocated
      this.lockSliders();
    } else {
      // Unlock sliders: max is total income
      this.unlockSliders();
    }
  }

  // Function to lock sliders by setting max to total allocated
  lockSliders() {
    const lockedTotalAllocated = this.totalAllocated;  // Store the current total allocated value
  
    this.categories.forEach(category => {
      category.max = lockedTotalAllocated;  // Set max for each slider to the total allocated value
      if (category.value > category.max) {
        category.value = category.max;  // Ensure the value doesn't exceed the max
      }
    });
  }
  

  // Simplified function to unlock sliders (max is total income)
  unlockSliders() {
    this.categories.forEach(category => {
      category.max = this.totalIncome;  // Set new max as total income
    });
  }

  adjustUnlockedSliders(changedCategory: any) {
    // Calculate total locked values
    const totalLocked = this.categories.reduce((acc, category) => category.locked ? acc + category.value : acc, 0);
    console.log('total locked value: ' + totalLocked)
    // Calculate the budget available for unlocked sliders
    const availableBudgetForUnlocked = this.totalAllocated - totalLocked;
    console.log('available for unlocked ' + availableBudgetForUnlocked)

    // Collect all unlocked sliders except the changed one
    const unlockedCategories = this.categories.filter(category => !category.locked && category !== changedCategory);
    console.log('Unlocked Categories:', JSON.stringify(unlockedCategories, null, 2));
    if (unlockedCategories.length === 0 || availableBudgetForUnlocked <= 0) {
      return;  // If no unlocked sliders or no available budget, exit early
    }
  
    // Calculate the total value of the remaining unlocked sliders (excluding the changed one)
    const totalUnlockedBeforeChange = unlockedCategories.reduce((acc, category) => acc + category.value, 0);
  
    // Calculate the remaining budget after the change in the current slider
    const remainingBudgetAfterChange = availableBudgetForUnlocked - changedCategory.value;
  
    // If the change results in exceeding the total allocated budget, cap the slider's value
    if (remainingBudgetAfterChange < 0) {
      changedCategory.value = availableBudgetForUnlocked;
      return;
    }
  
    // Adjust the other unlocked sliders proportionally
    unlockedCategories.forEach(category => {
      const proportion = totalUnlockedBeforeChange > 0 ? category.value / totalUnlockedBeforeChange : 1 / unlockedCategories.length;
      category.value = Math.max(proportion * remainingBudgetAfterChange, 0); // Ensure values don't go below 0
    });
  
    // Update the total allocated value
  }
  
  
  
  
}
