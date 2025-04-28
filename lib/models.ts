export interface User {
  UserID: number;
  Username: string;
  Email: string | null;
  PasswordHash: string;
  RegistrationDate: Date;
}

export interface Question {
  QuestionID: number;
  QuestionText: string;
  CorrectAnswer: string;
  IncorrectAns1: string;
  IncorrectAns2: string;
  IncorrectAns3: string;
  Difficulty: number;
  CategoryID: number;
}

export interface Category {
  CategoryID: number;
  Type: string;
  Subcategory: string;
}

export interface UserSubmission {
  SubmissionID: number;
  UserID: number;
  QuestionText: string;
  CorrectAnswer: string;
  IncorrectAns1: string;
  IncorrectAns2: string;
  IncorrectAns3: string;
  Status: boolean;
  SubmissionDate: Date;
  CategoryID: number;
  Difficulty: number;
}

export interface HighScore {
  UserID: number;
  HighScore: number;
  CategoryID: number;
}
