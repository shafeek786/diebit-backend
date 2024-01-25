import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';
import { WeightupdateComponent } from '../weightupdate/weightupdate.component';
import { AddfoddComponent } from '../addfodd/addfodd.component';
import { Chart } from 'chart.js/auto';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SharedcaloriesService } from '../../services/sharedcalories.service';
import { SharedCaloriesService } from 'src/app/shared-calories.service';
import { forkJoin,combineLatest  } from 'rxjs';

interface tokenData {
  id: string;
  name: string;
  email: string;
}

interface ApiResponse {
  userData: userData;
}

interface userData {
  id: string;
  name: string;
  gender: string;
  dateOfBirth: Date;
  height: number;
  weight: number;
}

interface foodHistory{
  name:string,
  quantity:number,
  size:number,
  calories:number
}

interface weight{
  weight:number
}

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackerComponent implements OnInit {
  email!: string;
  decodedToken!: tokenData;
  user!: userData;
  age: number = 0; 
  consumedCalories!: number;
  dailyFoodHistory: any[] = []
  weightHistory:weight[]=[]
  mergedData:any[]=[]
  constructor(
    private sharedService: SharedCaloriesService,
    private dialog: MatDialog,
    private service: AuthServiceService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.decodedToken = jwtDecode(localStorage.getItem('token') as string);
    this.email = this.decodedToken.email;
    
  this.getUser()
  this.service.getUsrFoodHistory(this.decodedToken.id).subscribe((res: any) => {
    this.consumedCalories = res.todayCalorieIntake;
    this.dailyFoodHistory = res.todayFoodRecords
    console.log("user fodd history: "+ this.dailyFoodHistory)
    this.consumeCalories()
    this.calculateBMR();
    
    this.cdr.detectChanges();
    this.updateMergedData()
  });

  this.service.getWeightHistoryTracker(this.decodedToken.id).subscribe((res:any) =>{
    console.log("user weight history: "+ res.todayWeightHistory)
    this.weightHistory = res.todayWeightHistory
    this.updateMergedData()

  })

  this.sharedService.consumedCalories$.subscribe((consumedCalories: number) => {
    this.consumedCalories = consumedCalories;
    this.calculateBMR();
    this.cdr.detectChanges();
  });
  this.sharedService.foodHistory$.subscribe((foodHistory: foodHistory[]) => {
    this.dailyFoodHistory = foodHistory;
    this.updateMergedData();
    this.cdr.detectChanges(); 
  });

 this.sharedService.weightTraker$.subscribe((weightHistoty:weight[])=>{
  this.weightHistory = weightHistoty
  this.updateMergedData()
  this.cdr.detectChanges()
 })

 this.sharedService.userData$.subscribe((userData:any)=>{
  this.user = userData
  this.calculateBMR()
  this.cdr.detectChanges()
 })
    
  
  }

  updateMergedData() {
    console.log('updateMergedData called');
    console.log('Daily Food History Length:', this.dailyFoodHistory);
    console.log('Weight History Length:', this.weightHistory?.length);
 
    const mergedData = [
       ...(this.dailyFoodHistory ),
       ...(this.weightHistory)
    ];
    mergedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    console.log('Merged Data:', mergedData);
 
    this.mergedData = mergedData;
 }
 
  
  
  

  getUser() {
    this.service.getUser(this.decodedToken.id).subscribe((res: any) => {
      console.log(res);
      const typedResponse = res as ApiResponse;
      this.user = typedResponse.userData;
      
      this.calculateAge();
      this.calculateBMR();
    });
  }


 getWeightHistory(){
  this.service.getWeightHistoryTracker(this.decodedToken.id).subscribe((res:any) =>{
    console.log("user weight history: "+ res.todayWeightHistory)
    this.weightHistory = res.todayWeightHistory
  })
 }



  calculateAge() {
    console.log(this.user);
    if (this.user && this.user.dateOfBirth) {
      const dateOfBirth = new Date(this.user.dateOfBirth);
      const today = new Date();
      this.age = today.getFullYear() - dateOfBirth.getFullYear();

      if (
        today.getMonth() < dateOfBirth.getMonth() ||
        (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate())
      ) {
        this.age--;
      }
    }
  }

  calculateBMR() {
    const bmr = this.calculateBMRValue(this.user.gender, this.user.weight, this.user.height, this.age);
    const cal: number = this.consumedCalories || 0;
      console.log(this.user.weight)

    setTimeout(() => {
      this.createChart(bmr, cal);
      this.cdr.detectChanges();
    });
  }

  calculateBMRValue(gender: string, weight: number, height: number, age: number): number {
    let bmr = 0;
    if (gender.toLowerCase() === 'male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else if (gender.toLowerCase() === 'female') {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
    }

    return Math.round(bmr);
  }

  calculateConsumedBRM() {
  }

  updateWeight() {
    this.dialog.open(WeightupdateComponent, {
      width: '100%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms'
    });
    console.log(this.email);
  }

  addFood() {
    this.dialog.open(AddfoddComponent, {
      width: '100%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms'
    });
  }

  destroyChart() {
    const ctx = document.getElementById('roundChart') as HTMLCanvasElement;
    const chart = Chart.getChart(ctx);
    
    if (chart) {
      chart.destroy();
    }

  }

  destroyChart2() {
    const ctx = document.getElementById('roundChart2') as HTMLCanvasElement;
    const chart = Chart.getChart(ctx);
    if (chart) {
      chart.destroy();
    }
   
  }

  destroyChart3() {
    const ctx = document.getElementById('roundChart3') as HTMLCanvasElement;
    const chart = Chart.getChart(ctx);
    if (chart) {
      chart.destroy();
    }
   
  }
consumeCalories(){
  this.createChart2()
  this.createChart3()
}
createChart(BMR: number, consumedCal: number): void {
  this.destroyChart(); 
  console.log(consumedCal);
  
  const ctx = document.getElementById('roundChart') as HTMLCanvasElement;
 
    const foodItem = this.dailyFoodHistory[0]
    const protein = foodItem.protein || 0
    const fat =  foodItem.fat || 0;
    const carbs = foodItem.carbohydrates || 0;
 
  
  


  const backgroundColors = ['grey', 'grey', 'grey']; // Initial grey colors for protein, fat, and carbs

  if (protein > 0 || fat > 0 || carbs > 0) {
    // If any of the nutrient values is greater than 0, use different colors
    backgroundColors[0] = 'red'; // Set color for protein
    backgroundColors[1] = 'blue'; // Set color for fat
    backgroundColors[2] = 'rgba(26, 215, 250, 0.8)'; // Set color for carbs
    const roundChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Protein', 'Fat', 'Carbs'],
        datasets: [{
          data: [protein, fat, carbs],
          backgroundColor: backgroundColors,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Consumed',
            font: {
              size: 18,
            },
          },
        },
      },
    });

  }

  const centerText = {
    id:'centerText',
    afterDatasetsDraw(chart: any, args: any, options: any) {
      const {ctx, chartArea: {left,right,top,bottom,width,height}} =
      chart
      ctx.save()
      ctx.font = 'bold 18px Arial'; 
      const text = '0';
      const textWidth = ctx.measureText(text).width;
      const textX = width / 2 - textWidth / 2;
      const textY = height / 2 + top - 5;
      ctx.fillText(text, textX, textY);
      ctx.fillText('Kcal', width / 2 - 22, height / 2 + top+15);
      ctx.restore();
    }
  }

  const roundChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [100], // Use a single value in the dataset
        backgroundColor: backgroundColors,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Consumed',
          font: {
            size: 18,
          },
        },
      },
      events: [], // Disable hover effects
    },
    plugins:[centerText]
  });
  
  
  
  
  
  
}




  createChart2(){
    this.destroyChart2(); 
  
    const ctx = document.getElementById('roundChart2') as HTMLCanvasElement;
    const roundChart2 = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['BMR', 'Consumed Calories'],
        datasets: [{
          data: [1526, 500],
          backgroundColor: ['purple', 'grey'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Burned',
            font: {
              size: 18,
            },
          },
        },
      },
    });
  }

  createChart3(){
    this.destroyChart3(); 
  
    const ctx = document.getElementById('roundChart3') as HTMLCanvasElement;
    const roundChart3 = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['BMR', 'Consumed Calories'],
        datasets: [{
          data: [1526, 500],
          backgroundColor: ['purple', 'grey'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Remaining',
            font: {
              size: 18,
            },
          },
        },
      },
    });
  }
}







const getUserFoodHistory = async (req, res) => {
  try {
    const userId = req.query.id;
    const date = req.query.date;
    console.log("Received date:", date);

    let startDate, endDate;

    if (date) {
      // If date is provided, filter based on that date
      startDate = new Date(date);
      console.log("Parsed date:", startDate.toISOString());
      startDate.setUTCHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setUTCHours(23, 59, 59, 999);
    } else {
      // If date is not provided, filter based on today
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      startDate = today;

      endDate = new Date(today);
      endDate.setUTCHours(23, 59, 59, 999);
    }


    console.log("in: " + startDate + " out: " + endDate);

    const foodHistory = await FoodIntake.find({ userId, date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() } });
    console.log(foodHistory);

    const todayCalorieIntake = foodHistory.reduce((totalCalories, record) => {
      const caloriesWithQuantity = record.calories * record.quantity;
      return totalCalories + caloriesWithQuantity;
    }, 0);

    res.json({ todayCalorieIntake, foodHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};