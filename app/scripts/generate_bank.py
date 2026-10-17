import csv
import json
import os
import re

def to_func_name(slug):
    clean = re.sub(r'[^a-zA-Z0-9]+', '_', slug).strip('_').lower()
    return clean or 'solve'

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
csv_path = os.path.join(base_dir, 'data', 'question_bank_300.csv')

with open(csv_path, 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

questions = []
for r in rows:
    qid = str(r['id'])
    slug = r['slug']
    title = r['title']
    diff = r['difficulty']
    topic = r['topic']
    func = to_func_name(slug)

    vis_id = None
    if 'Array' in topic or 'Sorting' in topic:
        vis_id = 'array-rotation'
    elif 'Tree' in topic or 'Recursion' in topic:
        vis_id = 'fibonacci'

    starter_py = f'''import sys

def {func}():
    # Implement solution for: {title}
    # Topic: {topic} ({diff})
    pass

if __name__ == '__main__':
    # Test with custom inputs
    {func}()
'''

    starter_java = f'''import java.util.*;

public class Solution {{
    // Implement solution for: {title}
    // Topic: {topic} ({diff})
    public static void main(String[] args) {{
        Scanner scanner = new Scanner(System.in);
        // Test with custom inputs
    }}
}}
'''

    q = {
        'id': qid,
        'slug': slug,
        'title': title,
        'difficulty': diff,
        'topic': topic,
        'tags': [topic, diff, 'Question Bank'],
        'visualizer_id': vis_id,
        'description': r['description'],
        'input_format': r['input_format'],
        'output_format': r['output_format'],
        'constraints': r['constraints'],
        'examples': [],
        'sample_test_cases': [],
        'hidden_test_cases': [],
        'hidden_test_cases_count': 0,
        'starter_code_python': starter_py,
        'starter_code_java': starter_java,
        'hints': [
            'Analyze problem constraints and choose optimal time complexity.',
            'Consider boundary and edge cases (empty inputs, single elements, negative values).'
        ],
        'editorial': f'The editorial explanation and test case suite for "{title}" are currently under verification. You can draft and test your logic with custom inputs.',
        'is_draft': True,
        'test_cases_status': r['test_cases_status']
    }
    questions.append(q)

# Write JSON for backend
json_path = os.path.join(base_dir, 'data', 'question_bank_300.json')
with open(json_path, 'w', encoding='utf-8') as out:
    json.dump(questions, out, indent=2)

# Write TypeScript for frontend
ts_path = os.path.join(os.path.dirname(base_dir), 'src', 'arena', 'questionBank.ts')
with open(ts_path, 'w', encoding='utf-8') as out:
    out.write('// AlgoMotion 300-Question Bank (Auto-generated from verified question bank)\n')
    out.write("import { CodingProblem } from '../types/arena';\n\n")
    out.write('export const QUESTION_BANK_300: CodingProblem[] = ')
    out.write(json.dumps(questions, indent=2))
    out.write(';\n')

print(f'Successfully processed {len(questions)} questions!')
print(f'JSON written to: {json_path}')
print(f'TypeScript written to: {ts_path}')
