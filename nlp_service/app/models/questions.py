def generate_questions(text):
    lines = text.split('. ')
    questions = []
    for idx, line in enumerate(lines[:5]):
        questions.append({
            'type': 'open-ended',
            'question': f"What is the meaning of: '{line.strip()}'?"
        })
    return questions
