/// <reference path="../../../../node_modules/monaco-editor/monaco.d.ts" />
import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  ElementRef,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonService } from '../../common.service';

let loadedMonaco = false;
let loadPromise: Promise<void>;

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() theme: string;
  @Input() fontSize: number;
  @Input() code: string;
  @Output() codeChange: EventEmitter<string>;
  @Input() insertText: EventEmitter<string>;
  @Input() id: string = 'code-editor';
  @Input() syntaxValidation: boolean = true;
  @Input() additionalProps: any = {};

  codeEditorInstance!: monaco.editor.IStandaloneCodeEditor;
  constructor(private commonService: CommonService, private ele: ElementRef) {
    this.theme = 'vs-light';
    this.fontSize = 14;
    this.code = '';
    this.codeChange = new EventEmitter();
    this.insertText = new EventEmitter();
  }

  ngOnInit(): void {
    this.id = this.id ? this.id : 'code-editor';
  }

  ngAfterViewInit(): void {
    if (loadedMonaco) {
      // Wait until monaco editor is available
      loadPromise.then(() => {
        this.initMonaco();
      });
    } else {
      loadedMonaco = true;
      loadPromise = new Promise<void>((resolve: any) => {
        if (typeof (window as any).monaco === 'object') {
          resolve();
          return;
        }
        const onAmdLoader: any = () => {
          // Load monaco
          (window as any).require.config({ paths: { vs: 'assets/monaco/vs' } });

          (window as any).require(['vs/editor/editor.main'], () => {
            this.initMonaco();
            resolve();
          });
        };

        // Load AMD loader if necessary
        if (!(window as any).require) {
          const loaderScript: HTMLScriptElement =
            document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = 'assets/monaco/vs/loader.js';
          loaderScript.addEventListener('load', onAmdLoader);
          document.body.appendChild(loaderScript);
        } else {
          onAmdLoader();
        }
      });
    }
    this.commonService.updateCodeEditorState.subscribe(() => {
      if (this.codeEditorInstance) {
        this.codeEditorInstance.updateOptions({
          fontSize: this.fontSize,
          theme: this.theme,
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.codeEditorInstance) {
      this.codeEditorInstance.updateOptions({
        fontSize: this.fontSize,
        theme: this.theme,
      });
    }
    if (
      changes &&
      changes['code'] &&
      changes['code'].currentValue !== changes['code'].previousValue &&
      this.code == undefined
    ) {
      this.codeEditorInstance.setValue('');
    }
  }

  initMonaco(): void {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: !this.syntaxValidation,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      lib: ['es5'],
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: false,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    });

    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range: monaco.IRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: [
            {
              range,
              label: 'router.post',
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: 'Add a POST Route',
              insertText: [
                "router.post('/', async (req, res) => {",
                '\t',
                '});',
              ].join('\n'),
            }
          ],
        };
      },
    });
    const id = this.id;
    this.codeEditorInstance = monaco.editor.create(
      document.getElementById(id) as HTMLElement,
      {
        value: this.code,
        language: 'javascript',
        theme: this.theme,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        fontSize: this.fontSize,
        minimap: { enabled: false },
        ...this.additionalProps,
      }
    );

    let model = this.codeEditorInstance.getModel() as monaco.editor.ITextModel;
    model.onDidChangeContent((e) => {
      const val = this.codeEditorInstance.getValue();
      this.codeChange.emit(val);
    });

    let height: number = (this.ele.nativeElement as HTMLElement).parentElement?.clientHeight || 0;
    let width: number = (this.ele.nativeElement as HTMLElement).parentElement?.clientWidth || 0;
    this.codeEditorInstance.layout({ height, width });

    this.insertText.subscribe((text: string) => {
      this.codeEditorInstance.trigger('keyboard', 'type', { text });
    });
  }
}
