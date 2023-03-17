import React, { useState, useEffect } from "react";
import './App.css';
import Spinner from "./Spinner";
import qbank from "./data/qbank";

//select 5 questions
const questions = ((qbank) => {
  const selectedQuestions = [];
  while (selectedQuestions.length < 5) {
    const randomIndex = Math.floor(Math.random() * qbank.length);
    if (!selectedQuestions.includes(qbank[randomIndex])) {
      selectedQuestions.push(qbank[randomIndex]);
    }
  }
  return selectedQuestions;
})(qbank);

const App = () => {
  const [text, setText] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [resultCard, setResultCard] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
  setIsLoading(true);
   try {
     const res = await fetch("http://localhost:8080/openai", {
       method: "POST",
       body: JSON.stringify({
         question: questions[currentQuestion].question,
         studentAnswer: text,
         correctAnswer: questions[currentQuestion].answer,
       }),
       headers: {
         "Content-Type": "application/json",
       },
     });
 
     if (!res.ok) { 
       throw new Error(res.statusText); 
     }
 
     const data = await res.json();
     setIsLoading(false);
     
     setResultCard((prevResultCard) => [
       ...prevResultCard,
       {
         qno: currentQuestion + 1,
         question: questions[currentQuestion].question,
         studentAnswer: text,
         suggetion: data.message,
       },
     ]);
     
     if (currentQuestion === questions.length - 1) {
       setQuizFinished(true);
       return;
     }
     
     setCurrentQuestion((prevCurrentQuetions) => prevCurrentQuetions + 1);
     setText("");
   } catch (err) {
     console.log(err);
   }
 };
 

  if(!quizFinished){
    return (
      <div className="container m-auto tracking-wide">
        <div className="bg-green-500 text-2xl p-3 text-center rounded-lg mt-3">
          {(currentQuestion + 1) + '. ' + questions[currentQuestion].question}
        </div>
        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 pt-10">
          <textarea
            value={text}
            placeholder="Your answer here..."
            name="textbody"
            className="border-2 w-10/12 h-96 border-zinc-400 m-auto p-4"
            onChange={(e) => setText(e.target.value)}
          />
          <div className="text-right">
            {!isLoading ? <button
              type="submit"
              className="tracking-wide text-3xl hover:bg-gray-600 w-2/12 mt-2 p-4 border bg-green-500 text-white rounded-lg"
            >
              Next
            </button> : 
            <button
              type=""
              className="tracking-wide text-3xl hover:bg-gray-600 w-2/12 mt-2 p-4 border bg-green-500 text-white rounded-lg"
            >
              <Spinner />
            </button>}
          </div>
        </form>
      </div>
    );
  }else{
    return (
      <div className="container m-auto tracking-wide ">
        <div className="bg-green-500  p-3 text-center rounded-lg mt-3">
          Result
        </div>
        <div>
        {resultCard.map((item, i) => (
          <ul key={i}>
            <li>
              <div>
                <span className="text-lg text-orange-400">Question:</span> {item.question}
              </div>
              <div>
                <span className="text-lg text-green-700">Your Answer:</span>{" "}
                {item.studentAnswer}
              </div>
              <div>
                 {item.suggetion}
              </div>
            </li>
          </ul>
        ))}
        </div>
        <div className="mt-4">
        <a href="/" class="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded ">Back</a>
        </div>
        
      </div>
    );
  }
  
};

export default App;
