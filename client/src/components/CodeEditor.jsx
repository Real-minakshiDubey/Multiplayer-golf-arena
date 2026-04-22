import Editor from '@monaco-editor/react';

export default function CodeEditor({ language, value, onChange }) {
  const monacoLangMap = {
    javascript: 'javascript',
    python: 'python',
    ruby: 'ruby',
    go: 'go',
    rust: 'rust',
    c: 'c',
    cpp: 'cpp',
    typescript: 'typescript',
    lua: 'lua',
    php: 'php'
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/5">
      <Editor
        height="350px"
        language={monacoLangMap[language] || 'javascript'}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          minimap: { enabled: false },
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          tabSize: 2,
          automaticLayout: true,
        }}
      />
    </div>
  );
}