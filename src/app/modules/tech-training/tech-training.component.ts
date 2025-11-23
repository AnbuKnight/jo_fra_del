import { Component, OnInit } from '@angular/core';

interface Course {
  id: string;
  name: string;
  level: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
}

interface Review {
  id: string;
  author: string;
  course: string;
  rating: number;
  text: string;
  image?: string;
}

@Component({
  selector: 'app-tech-training',
  templateUrl: './tech-training.component.html',
  styleUrls: ['./tech-training.component.scss'],
})
export class TechTrainingComponent implements OnInit {
  courses: Course[] = [
    {
      id: 'angular',
      name: 'ANGULAR',
      level: 'Intermediate to Advanced',
      description:
        'Master modern web development with Angular framework. Learn components, services, routing, and RxJS.',
      duration: '12 weeks',
      icon: '⚡',
      color: '#dd0031',
    },
    {
      id: 'html',
      name: 'HTML',
      level: 'Beginner to Intermediate',
      description:
        'Comprehensive HTML course covering semantic HTML, forms, accessibility, and best practices.',
      duration: '4 weeks',
      icon: '🏗️',
      color: '#e34c26',
    },
    {
      id: 'css',
      name: 'CSS',
      level: 'Beginner to Intermediate',
      description:
        'Master CSS styling, layouts, flexbox, grid, animations, and responsive design principles.',
      duration: '6 weeks',
      icon: '🎨',
      color: '#1572b6',
    },
    {
      id: 'typescript',
      name: 'TYPESCRIPT',
      level: 'Intermediate',
      description:
        'Learn TypeScript fundamentals, types, interfaces, decorators, and advanced concepts for scalable code.',
      duration: '8 weeks',
      icon: '📘',
      color: '#3178c6',
    },
    {
      id: 'dotnet',
      name: '.NET',
      level: 'Intermediate to Advanced',
      description:
        'Build enterprise applications with C# and .NET framework. Learn ASP.NET, Entity Framework, and more.',
      duration: '14 weeks',
      icon: '🔷',
      color: '#512bd4',
    },
    {
      id: 'mssql',
      name: 'MS SQL',
      level: 'Intermediate',
      description:
        'Master SQL database design, queries, stored procedures, performance tuning, and database administration.',
      duration: '8 weeks',
      icon: '🗄️',
      color: '#cc2927',
    },
  ];

  reviews: Review[] = [
    {
      id: '1',
      author: 'Rajesh Kumar',
      course: 'ANGULAR',
      rating: 5,
      text: 'Excellent training! The instructors are highly knowledgeable and the curriculum is up-to-date. I got a job immediately after completing the course.',
    },
    {
      id: '2',
      author: 'Priya Singh',
      course: 'TYPESCRIPT',
      rating: 5,
      text: 'The hands-on approach to teaching TypeScript was fantastic. Complex concepts were explained clearly with real-world examples.',
    },
    {
      id: '3',
      author: 'Amit Patel',
      course: '.NET',
      rating: 4,
      text: 'Great course with comprehensive coverage of .NET ecosystem. The projects were challenging and helped solidify my understanding.',
    },
    {
      id: '4',
      author: 'Sarah Johnson',
      course: 'MS SQL',
      rating: 5,
      text: 'Highly recommended! The SQL course transformed my understanding of databases. Perfect for beginners and experienced developers alike.',
    },
    {
      id: '5',
      author: 'Deepak Verma',
      course: 'HTML & CSS',
      rating: 5,
      text: 'Outstanding training programs! The mentors are approachable and always ready to help. Definitely worth the investment.',
    },
  ];

  selectedCourse: Course | null = null;
  filteredReviews: Review[] = this.reviews;

  constructor() {}

  ngOnInit() {
    this.filteredReviews = this.reviews;
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.filteredReviews = this.reviews.filter(
      (review) => review.course === course.name
    );
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(1);
  }

  getAllReviews() {
    this.selectedCourse = null;
    this.filteredReviews = this.reviews;
  }
}
