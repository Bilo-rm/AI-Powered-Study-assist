def generate_questions(text):
    lines = text.split('. ')
    questions = []

    for idx, line in enumerate(lines[:5]):
        clean_line = line.strip()

        # Open-ended question
        questions.append({
            'type': 'open-ended',
            'question': f"What is the meaning of: '{clean_line}'?"
        })

        # Multiple-choice question
        questions.append({
            'type': 'multiple-choice',
            'question': f"What is the correct meaning of: '{clean_line}'?",
            'options': [
                f"Option A for '{clean_line}'",
                f"Option B for '{clean_line}'",
                f"Option C for '{clean_line}'",
                f"Option D for '{clean_line}'"
            ],
            'answer': f"Option A for '{clean_line}'"  # default for now
        })

    return questions
