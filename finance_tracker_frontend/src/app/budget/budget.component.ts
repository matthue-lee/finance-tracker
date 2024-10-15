import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf and *ngFor
import { FormsModule } from '@angular/forms';  // Import FormsModule

@Component({
  selector: 'app-budget',
  standalone: true,  // Mark the component as standalone
  imports: [CommonModule, FormsModule],  // Import CommonModule to use *ngIf and *ngFor
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
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
  lockedTotalAllocated = 0;

  onInputChange(category: any) {
    if (!category.locked) {
      this.updateTotal();
    }
    if (this.isTotalBudgetLocked) {
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
// Toggle function for locking/unlocking the total budget
toggleTotalBudgetLock() {
  this.isTotalBudgetLocked = !this.isTotalBudgetLocked;

  if (this.isTotalBudgetLocked) {
    // Lock the total allocated value at the moment of locking
    this.lockedTotalAllocated = this.totalAllocated;
  }

  // Call updateMaxValues to ensure sliders can adjust within the locked total
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
      // When the budget is locked, calculate available budget
      const availableBudgetForUnlocked = this.lockedTotalAllocated - this.sumOfLockedSliders();
  
      // Set max for each slider based on the available budget
      this.categories.forEach(category => {
        if (!category.locked) {
          category.max = availableBudgetForUnlocked;  // Max for unlocked sliders
        } else {
          category.max = category.value;  // Keep the max as the current value for locked sliders
        }
      });
    } else {
      // If unlocked, all sliders can have max as total income
      this.categories.forEach(category => {
        category.max = this.totalIncome;  // Set new max as total income
      });
    }
  }
  

  sumOfLockedSliders(): number {
    return this.categories
      .filter(category => category.locked)
      .reduce((acc, category) => acc + category.value, 0);
  }
  
  

  // Function to lock sliders by setting max to total allocated
// Function to lock sliders by setting max to total allocated (or locked total)
  lockSliders(lockedTotal: number) {
    this.categories.forEach(category => {
      category.max = lockedTotal;  // Set max for each slider to the locked total allocated value
      if (category.value > category.max) {
        category.value = category.max;  // Ensure the value doesn't exceed the max
      }
    });
  }

  

  // Simplified function to unlock sliders (max is total income)
// Simplified function to unlock sliders (max is total income)
unlockSliders(totalIncome: number) {
  this.categories.forEach(category => {
    category.max = totalIncome;  // Set new max as total income
  });
}


  adjustUnlockedSliders(changedCategory: any) {
    // Calculate total locked values
    const totalLocked = this.categories.reduce((acc, category) => category.locked ? acc + category.value : acc, 0);
  
    // Calculate the available budget for unlocked sliders
    const availableBudgetForUnlocked = this.lockedTotalAllocated - totalLocked;
  
    // Get all unlocked categories except the one that was just changed
    const unlockedCategories = this.categories.filter(category => !category.locked && category !== changedCategory);
  
    // If no unlocked categories exist, or there's no available budget, exit early
    if (unlockedCategories.length === 0 || availableBudgetForUnlocked <= 0) {
      return;
    }
  
    // Calculate the total value of the remaining unlocked sliders before the change
    const totalUnlockedBeforeChange = unlockedCategories.reduce((acc, category) => acc + category.value, 0);
  
    // Calculate the remaining budget after the change in the current slider
    const remainingBudgetAfterChange = availableBudgetForUnlocked - changedCategory.value;
  
    // If the remaining budget is negative, cap the current slider to the available budget
    if (remainingBudgetAfterChange < 0) {
      changedCategory.value = availableBudgetForUnlocked;
      return;
    }
  
    // Redistribute the remaining budget proportionally among the other unlocked sliders
    let totalRounded = 0;
    unlockedCategories.forEach((category, index) => {
      if (index === unlockedCategories.length - 1) {
        // Assign the remaining budget to the last unlocked slider to ensure the sum matches
        category.value = remainingBudgetAfterChange - totalRounded;
      } else {
        // Distribute proportionally
        const proportion = totalUnlockedBeforeChange > 0 ? category.value / totalUnlockedBeforeChange : 1 / unlockedCategories.length;
        category.value = Math.round(proportion * remainingBudgetAfterChange);
        totalRounded += category.value; // Keep track of the rounded total
      }
    });
  
    // Update the total allocated value after redistribution
    this.updateTotal();
  }
  
  
  
}
