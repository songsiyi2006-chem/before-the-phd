from pathlib import Path
import sys
root = Path(__file__).parent
out = Path(sys.argv[1]) if len(sys.argv)>1 else root.parent / 'outputs'
out.mkdir(parents=True,exist_ok=True)
text = (root / 'template.html').read_text(encoding='utf-8')
for mark, filename in [('STYLE','style.css'),('DATA','data.js'),('QUESTIONS','questions.js'),('COLLECTIONS','collections.js'),('EXPANSION','expansion.js'),('ENGINE','engine.js'),('ART_EXTRA','art-extra.js'),('ART','art.js'),('VALIDATION','validation.js'),('APP','app.js')]:
    text = text.replace('/* '+mark+' */', (root / filename).read_text(encoding='utf-8'))
staging = out / '上岸之前.html.next'
staging.write_text(text, encoding='utf-8')
staging.replace(out / '上岸之前.html')
print(f'Built {len(text.encode("utf-8")):,} bytes')
