import browser from "webextension-polyfill";
import {ProcessedQuestionAnswer} from "./checker/AllDataProcessor.ts";

console.log("Content script loaded");

const askForAnswers = (taskIds: QuestionId[]) => {
    console.debug(`Found ${taskIds.length} tasks on page`)
    const answers = browser.runtime.sendMessage(taskIds) as Promise<ProcessedQuestionAnswer[][]>;
    answers.then(a => {
            if (!a) return;
            console.log(`Return ${a.length} tasks`)
            a.forEach(taskAnswers => {
                if (!taskAnswers) return
                taskAnswers.forEach(answer =>
                    insertAnswer(answer)
                )
            })
        }
    )
}

const insertAnswer = (answer: ProcessedQuestionAnswer) => {
    if (!answer) {
        console.error("Answer is null")
        return
    }
    if (!answer.isCorrect) {
        console.debug("answer is incorrect, skipping")
        return
    }
    const questionElement = document.getElementById(answer.taskId);
    console.log(`Looking for element with id: ${answer.taskId}`)
    if (questionElement) {
        // Create a new element for the answer
        console.log(`Found element with id: ${answer.taskId}`)
        const answerElement = document.createElement('div');
        answerElement.textContent = `HINT (ANSWER): ${answer.solution}`;
        console.log(`Inserting answer: ${answer.solution}`)
        // Append the answer element to the parent of the question element
        questionElement.parentNode?.appendChild(answerElement);
    }
}

if (window.location.href.includes("courses.openedu.ru")) {
    console.log("OpenEdu course page detected");
    const questionElements: NodeListOf<Element> = document.querySelectorAll('[id^="input_"]');
    const taskIds = Array.from(questionElements).map((element: Element) => element.id);
    askForAnswers(taskIds);
}

