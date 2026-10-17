import React, { useState, useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { SupportedLanguage } from '../../types/algorithm';
import { Copy, RotateCcw, Check, Code2, AlertCircle, FileCode } from 'lucide-react';

interface CodeEditorPanelProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  codePython: string;
  codeJava: string;
  currentLinePython?: number;
  currentLineJava?: number;
  onCodeChange?: (newCode: string) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  language,
  onLanguageChange,
  codePython,
  codeJava,
  currentLinePython,
  currentLineJava,
  onCodeChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [localCode, setLocalCode] = useState<string>(language === 'python' ? codePython : codeJava);
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  // Sync localCode when language or algorithm changes
  useEffect(() => {
    setLocalCode(language === 'python' ? codePython : codeJava);
  }, [language, codePython, codeJava]);

  const activeLine = language === 'python' ? currentLinePython : currentLineJava;

  // On editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Update line highlight decoration whenever activeLine changes
  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current;

    if (activeLine && activeLine > 0) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: {
            startLineNumber: activeLine,
            startColumn: 1,
            endLineNumber: activeLine,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'bg-blue-900/40 border-l-4 border-cyan-400',
            glyphMarginClassName: 'bg-cyan-400',
          },
        },
      ]);
      editor.revealLineInCenterIfOutsideViewport(activeLine);
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [activeLine]);

  const handleCopy = () => {
    navigator.clipboard.writeText(localCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const original = language === 'python' ? codePython : codeJava;
    setLocalCode(original);
    if (onCodeChange) onCodeChange(original);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#090D16] border border-slate-800 overflow-hidden shadow-xl">
      {/* Tab bar & Actions */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs">
        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onLanguageChange('python')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs font-semibold transition-all ${
              language === 'python'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Python</span>
          </button>

          <button
            onClick={() => onLanguageChange('java')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs font-semibold transition-all ${
              language === 'java'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Java</span>
          </button>
        </div>

        {/* Current Executing Line Badge */}
        {activeLine && (
          <div className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-700/60 text-cyan-300 font-mono text-[11px] font-bold animate-pulse">
            Executing Line {activeLine}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            title="Copy Code"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Reset to Original Code"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 w-full min-h-[300px] relative">
        <Editor
          height="100%"
          language={language === 'python' ? 'python' : 'java'}
          theme="vs-dark"
          value={localCode}
          onChange={(val) => {
            setLocalCode(val || '');
            if (onCodeChange) onCodeChange(val || '');
          }}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Sandbox Notice Banner */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Execution Engine: Deterministic trace-replay with real line-level synchronization.</span>
        </span>
        <span className="text-slate-500 font-mono hidden sm:inline">
          {language === 'python' ? 'Python 3.12+' : 'OpenJDK 21+'}
        </span>
      </div>
    </div>
  );
};
