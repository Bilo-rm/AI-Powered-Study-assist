from transformers import pipeline
from dotenv import load_dotenv
import os

load_dotenv()
model_name = os.getenv("SUMMARIZER_MODEL")
summarizer = pipeline("summarization", model=model_name)

def generate_summary(text):
    summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    return summary[0]['summary_text']
