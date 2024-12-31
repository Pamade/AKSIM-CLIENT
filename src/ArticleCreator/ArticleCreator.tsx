import  { useState, useRef} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import DOMPurify from 'dompurify';
import '../ql-config.scss'
import axios from 'axios';

type Insert = {
    insert:string,
    attribues?:any;
}

interface D {
    ops:[Insert]
}
interface Props{
    handleChangeArticleContent: (html: string) => void
}
function ArticleCreator({handleChangeArticleContent}:Props){

    const [delta, setDelta] = useState<D>({} as D);
    const [savedDeltas, setSavedDeltas] = useState<string[]>([])
    const [html, setHtml] = useState("")
    const quillRef:any = useRef(null);
    const [editorHtml, setEditorHtml] = useState('');

    const handleArticleImageUpload = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
    
        input.click();
    
        input.onchange = async () => {
          const file = input.files?.[0];
          if (file) {
            const formData = new FormData();
            formData.append('file', file);
            
            try {
              // Send the image to the server for storage
              const response = await axios.post('http://localhost:8080/api/auth/add-image-to-article', formData, {
                headers: {
                   Authorization: "Bearer " + localStorage.getItem("access_token"), 
                  'Content-Type': 'multipart/form-data',
                },
              });
    
              // Get the URL of the uploaded image
              const imageUrl = response.data.url;
    
              // Insert the image URL into the editor
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection();
              editor.insertEmbed(range.index, 'image', imageUrl);
            } catch (error) {
              console.error('Error uploading image:', error);
            }
          }
        };
      };
    const modules = {
        toolbar: {
            container:[
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
            ],handlers: {
                image:handleArticleImageUpload
            },}
       
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
            handleChangeArticleContent(sanitizedHtml)
        }
        }  
    };


    
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
            <form onSubmit={handleSubmit}>
                <ReactQuill modules={modules} ref={quillRef} theme="snow" onChange={handleChange} />
            </form>
            <div style={{
                whiteSpace: "pre-wrap", // Ensures spaces, tabs, and line breaks are preserved
                marginTop: "20px",
        }} dangerouslySetInnerHTML={{ __html:editorHtml}} />

            {/* <h1>Created Quills</h1>
            {savedDeltas.map((deltaJson, index) => {
                const delta = JSON.parse(deltaJson);
                const html = getHTMLFromDelta(delta);
                return <div style={{
                    whiteSpace: "pre-wrap", // Ensures spaces, tabs, and line breaks are preserved
                    marginTop: "20px",
                  }} key={index} dangerouslySetInnerHTML={{ __html: html }} />;
            })} */}
        </div>
    );

}

export default ArticleCreator;