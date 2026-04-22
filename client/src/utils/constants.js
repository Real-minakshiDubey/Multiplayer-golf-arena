export const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'ruby', name: 'Ruby', icon: '💎' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
  { id: 'c', name: 'C', icon: '⚙️' },
  { id: 'cpp', name: 'C++', icon: '➕' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'lua', name: 'Lua', icon: '🌙' },
  { id: 'php', name: 'PHP', icon: '🐘' }
];

export const STARTER_CODE = {
  javascript: '// Read input from stdin\nconst input = require("fs").readFileSync("/dev/stdin","utf8").trim();\n\n// Your solution here\nconsole.log(input);',
  python: 'import sys\ninput_data = sys.stdin.read().strip()\n\n# Your solution here\nprint(input_data)',
  ruby: 'input = STDIN.read.strip\n\n# Your solution here\nputs input',
  go: 'package main\nimport("bufio"\n"fmt"\n"os")\nfunc main(){\ns:=bufio.NewScanner(os.Stdin)\ns.Scan()\nfmt.Println(s.Text())\n}',
  rust: 'use std::io;\nfn main(){\nlet mut input=String::new();\nio::stdin().read_line(&mut input).unwrap();\nprintln!("{}",input.trim());\n}',
  c: '#include<stdio.h>\nint main(){char s[1000];fgets(s,1000,stdin);printf("%s",s);return 0;}',
  cpp: '#include<iostream>\nusing namespace std;\nint main(){string s;getline(cin,s);cout<<s;return 0;}',
  typescript: 'const input = require("fs").readFileSync("/dev/stdin","utf8").trim();\nconsole.log(input);',
  lua: 'local input = io.read("*a"):match("^%s*(.-)%s*$")\nprint(input)',
  php: '<?php $input = trim(fgets(STDIN)); echo $input;'
};