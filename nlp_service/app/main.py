from fastapi import FastAPI
from app.schemas.request_schema import TextRequest
from app.schemas.response_schema import SummaryResponse, FlashcardResponse, QuestionsResponse
from app.models.summarizer import generate_summary
from app.models.flashcards import generate_flashcards
from app.models.questions import generate_questions
from app.utils.text_utils import clean_text

app = FastAPI()

@app.post("/summarize", response_model=SummaryResponse)
def summarize_text(request: TextRequest):
    text = clean_text(request.text)
    summary = generate_summary(text)
    return {"summary": summary}

@app.post("/flashcards", response_model=FlashcardResponse)
def flashcards_text(request: TextRequest):
    text = clean_text(request.text)
    flashcards = generate_flashcards(text)
    return {"flashcards": flashcards}

@app.post("/questions", response_model=QuestionsResponse)
def questions_text(request: TextRequest):
    text = clean_text(request.text)
    questions = generate_questions(text)
    return {"questions": questions}
