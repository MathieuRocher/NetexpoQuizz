import { Component } from '@angular/core';

interface QuizQuestion {
  image: string;
  question: string;
  comment: string;
  answers: string[];
  correctAnswerIndex: number;
  userAnswer: number | undefined;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  quiz: QuizQuestion[] = [
    {
      image: "assets/illustration/start.webp",
      question: "To win a gift, please try to answer to these 3 questions correctly on our <b>GE&nbsp;HealthCare</b> Clinical Accessories?",
      comment: "",
      answers: [],
      correctAnswerIndex: 0,
      userAnswer: undefined,
    },
    {
      image: "assets/illustration/question1.webp",
      question: "Which one is a <b>GE HealthCare</b> proprietary <b>SpO<sub>2</sub></b> technology",
      comment: "Select the right answer",
      answers: ["TruSignal", "Masimo RD-Set", "Nellcor OxiMax™"],
      correctAnswerIndex: 1,
      userAnswer: undefined
    },
    {
      image: "assets/illustration/question2.jpg",
      question: "Do you know if <b>GE HealthCare NIBP Cuff</b> can be used with others monitors than GE HealthCare?",
      comment: "",
      answers: ["Yes", "No"],
      correctAnswerIndex: 1,
      userAnswer: undefined
    },
    {
      image: window.innerWidth>1366?"assets/illustration/question3.jpg":'assets/illustration/question3-tablette.jpg',
      question: "<b>NMT</b> is used for:",
      comment: "Select the right answer",
      answers: ["Patient response to surgical stimuli and analgesic medications", "Depth of anaesthesia monitoring", "Neuromuscular blockage monitoring"],
      correctAnswerIndex: 3,
      userAnswer: undefined
    },
  ];
  warning = "";
  questionWrong = "";
  answerRight = "";
  message = "";
  step: number = 0;
  winner: boolean = false;
  badgeId = "";

  constructor() { }

  async next() {
    if (this.quiz[this.step].userAnswer === undefined && this.quiz[this.step].answers.length > 0) {
      this.warning = "Please select an answer";
      console.log(" NEXT : NOT ANSWERED");

    } else {
      this.warning = "";
      if (this.step < this.quiz.length) {
        this.step++;
      }
      console.log(" NEXT : ", this.step, " ON ", this.quiz.length);
      if (this.step === this.quiz.length) {
        this.winner = this.completeQuiz();
        window.addEventListener('keydown', this.pressHandler, false);
      }
    }
  }

  pressHandler = (e: { code: string; key: string | any[]; }) => {
    console.log(" PRESS Code=>" + e.code + " Key=>" + e.key + " buffer [" + this.badgeId + "]");
    if (e.code == 'Enter' || e.code == 'NumpadEnter' || e.key == 'Enter') {
      // console.log(" VALID Buffer ", this.inputBuffer);
      if (this.badgeId.length > 0) {
        this.redirectToFasteLeads(this.badgeId);
        this.badgeId = "";
      }
    } else {
      if (!this.badgeId) {
        this.badgeId = "";
      }
      if (e.key == 'Backspace') {
        this.badgeId = "";
        console.log(" CLEAR buffer (BackSpace) [" + this.badgeId + "]");
      } else if (e.key == 'Shift' || e.key == 'Control' || e.key == 'Alt' || e.key == 'AltGraph' || e.key == 'Meta') {
        console.log(" Special KEY detected " + e.key + " buffer [" + this.badgeId + "]");
      } else {
        if (e.key.length == 1) {
          // console.log(" Standard KEY detected " + e.key);
          this.badgeId += e.key;
          console.log(" KEY " + e.key + " buffer [" + this.badgeId + "]");
        } else {
          console.log(" NON-Standard KEY detected " + e.key + " ignored - buffer [" + this.badgeId + "]");
        }
      }
    }
  }

  completeQuiz(): boolean {
    let winQuiz = true;
    this.warning = "Congratulations!";
    this.message = "All yours answers are correct.";
    this.answerRight="";
    this.questionWrong="";

    for (const q of this.quiz) {
      if (q.answers.length > 0) { // c'est une question avec réponse 
        if (q.userAnswer == undefined || q.userAnswer !== q.correctAnswerIndex - 1) {
          console.log(" Incorrect answer (", q.question, ")", q.userAnswer, " expected=", q.correctAnswerIndex - 1);
          this.warning = "Incorrect answer for question:";
          this.questionWrong = q.question;
          this.message = "Right answer is:";

          this.answerRight = q.answers[q.correctAnswerIndex - 1];
          winQuiz = false;
          break;
        } else {
          console.log(" Correct answer (", q.question, ")", q.userAnswer, " expected=", q.correctAnswerIndex - 1);
          winQuiz = true;
        }
      }
    }
    console.log(" WIN : ", winQuiz);
    return winQuiz;
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave");
    // Retire l'écouteur d'événements lors de la destruction du composant
    window.removeEventListener('keydown', this.pressHandler);
  }

  selectAnswer(e: any) {
    console.log(" ANSWER selected ", e.target.value, " replace ", this.quiz[this.step].userAnswer);
    this.quiz[this.step].userAnswer = e.target.value;
    this.warning = "";
  }

  async previous() {
    // await this.changeImg()
    if (this.step > 0) {
      this.step--;
      console.log(" PREVIOUS : ", this.step);
      this.warning = "";
    } else {
      console.log(" PREVIOUS ON STEP : ", this.step, " !!!!");
    }
  }
  redirectToFasteLeads(badgeId: string) {
    if (badgeId && badgeId.length > 0) {
    console.log(" REDIRECT : ", badgeId, " from ", window.location);
    let redirectUrl = (!window.location.href.startsWith("http://localhost") ? "https://f.nxp.lk" : "http://localhost:8100");
    let quizUrl = (!window.location.href.startsWith("http://localhost") ? "quiz" : "local");
    redirectUrl += "/lead/" + badgeId + "?source=" + quizUrl;
    console.log(" REDIRECT > ", redirectUrl);
    window.location.href = redirectUrl;
    } else {
      console.log(" NO badgeId ");
    }
  }

  restartQuiz() {
    console.log(" Restart quiz!");
    for (const q of this.quiz) { q.userAnswer = undefined; }
    this.warning = "";
    this.message = "";
    this.answerRight="";
    this.questionWrong="";
    this.step = 0;
    this.badgeId="";
  }


}
