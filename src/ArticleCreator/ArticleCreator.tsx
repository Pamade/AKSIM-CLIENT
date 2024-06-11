import  { useState, useRef} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import DOMPurify from 'dompurify';
import '../ql-config.scss'


type Insert = {
    insert:string,
    attribues?:any;
}

interface D {
    ops:[Insert]
}

function ArticleCreator(){

    const [delta, setDelta] = useState<D>({} as D);
    const [savedDeltas, setSavedDeltas] = useState<string[]>([])
    const [html, setHtml] = useState("")
    const quillRef:any = useRef(null);
    const [editorHtml, setEditorHtml] = useState('');

    const modules = {
        toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
        ]
    };

    const handleChange = (content:any, delta:any, source:any, editor:any) => {
        // Update delta object when content changes
        setDelta(editor.getContents());
        if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        if (editor) {
            const html = editor.root.innerHTML;
            const sanitizedHtml = DOMPurify.sanitize(html);
            setEditorHtml(sanitizedHtml);
        }
        }  
    };

    // grabs delta from db object and sets into html
    // const getHTMLFromDelta = (delta:any) => {
    //   const tempQuill = new Quill(document.createElement('div'));
    //   tempQuill.setContents(delta);
    //   return tempQuill.root.innerHTML;
    // };  

    
    const handleSubmit = (event:any) => {
        event.preventDefault();
        const deltaJson = JSON.stringify(delta);
        setSavedDeltas(deltas => [...deltas, deltaJson])
        
    };
    const getHTMLFromDelta = (delta:any) => {
        const tempQuill = new Quill(document.createElement('div'));
        tempQuill.setContents(delta);
        return tempQuill.root.innerHTML;
    };

    return (
        <div className="main">
            <h1>Creation: </h1>
            <h1>Quill Text Editor Example</h1>
            <form onSubmit={handleSubmit}>
                <ReactQuill modules={modules} ref={quillRef} theme="snow" onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>
            <div dangerouslySetInnerHTML={{ __html: editorHtml }} />

            <h1>Created Quills</h1>
            {savedDeltas.map((deltaJson, index) => {
                const delta = JSON.parse(deltaJson);
                const html = getHTMLFromDelta(delta);
                return <div key={index} dangerouslySetInnerHTML={{ __html: html }} />;
            })}
        </div>
    );

}

export default ArticleCreator;