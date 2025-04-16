from pydantic import BaseModel
from typing import List

class SummaryResponse(BaseModel):
    summary: str

class Flashcard(BaseModel):
    term: str
    definition: str

class FlashcardResponse(BaseModel):
    flashcards: List[Flashcard]

class Question(BaseModel):
    type: str
    question: str
    options: list | None = None

class QuestionsResponse(BaseModel):
    questions: List[Question]
