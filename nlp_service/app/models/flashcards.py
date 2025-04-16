def generate_flashcards(text):
    lines = text.split('. ')
    flashcards = []
    for line in lines:
        if ':' in line:
            term, definition = line.split(':', 1)
            flashcards.append({'term': term.strip(), 'definition': definition.strip()})
    return flashcards[:10]  # limit to 10
