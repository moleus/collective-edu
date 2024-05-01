import browser from "webextension-polyfill";
import {ProcessedQuestionAnswer} from "./checker/AllDataProcessor.ts";

console.log("Content script loaded");

const askForAnswers = (taskIds: QuestionId[]) => {
    console.debug(`Found ${taskIds.length} tasks on page`)
    const answers = browser.runtime.sendMessage(taskIds) as Promise<ProcessedQuestionAnswer[]>;
    answers.then(a => {
            a.forEach(answer => {
                insertAnswer(answer)
            })
        }
    )
}

const isChoiceSolution = (answer: string): boolean => {
    return answer.includes("choice_")
}

const addHint = (elementId: string, answer: string) => {
    const questionElement = document.getElementById(elementId);
    console.log(`Looking for element with id: ${elementId}`)
    if (questionElement) {
        // Create a new element for the answer
        console.log(`Found element with id: ${elementId}`)
        console.log(`Inserting answer: ${answer}`)
        const answerElement = document.createElement('div');
        answerElement.textContent = `hint: ${answer} ⤴`;
        answerElement.style.marginBottom = '10px'; // Add space below the div
        questionElement.parentNode?.appendChild(answerElement);
    }
}

const insertAnswer = (answer: ProcessedQuestionAnswer) => {
    if (!answer.isCorrect) {
        console.debug("answer is incorrect, skipping")
        return
    }
    if (answer.solution.length == 0) {
        console.warn(`Solution length for task ${answer.taskId} must be at least 1`)
        return
    }
    if (answer.solution.some(isChoiceSolution)) {
        answer.solution.forEach(s => {
            addHint(`${answer.taskId}_${s}`, "Answer above is correct.")
        })
    } else {
        addHint(answer.taskId, answer.solution[0])
    }
}

if (window.location.href.includes("courses.openedu.ru")) {
    console.log("OpenEdu course page detected");
    const questionElements: NodeListOf<Element> = document.querySelectorAll('[id^="input_"]');
    const taskIds = Array.from(questionElements).map((element: Element) => element.id).map((id: string) => id.replace(/_choice_\d*/, ""));
    const uniqueTasks = [...new Set(taskIds)]
    askForAnswers(uniqueTasks);
}

