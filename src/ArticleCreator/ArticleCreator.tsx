import  { useState, useRef, useMemo} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import DOMPurify from 'dompurify';
import '../ql-config.scss'
import axios from 'axios';

interface Props{
    handleChangeArticleContent: (html: string) => void
}
function ArticleCreator({handleChangeArticleContent}:Props){

    const quillRef:any = useRef(null);

    const handleArticleImageUpload = () => {
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
              const response = await axios.post('http://localhost:8080/api/user/add-image-to-article', formData, {
                headers: {
                   Authorization: "Bearer " + localStorage.getItem("access_token"), 
                  'Content-Type': 'multipart/form-data',
                },
              });
              const imageUrl = response.data;

              const editor = quillRef.current.getEditor(); 
              const range = editor.getSelection();
              editor.insertEmbed(range.index, 'image', imageUrl);

            } catch (error) {
              console.error('Error uploading image:', error);
            }
          }
        };
      };
    const modules = useMemo(() =>( {
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
       
    }), []);

    const handleChange = () => {

        if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        if (editor) {
            const html = editor.root.innerHTML;
            const sanitizedHtml = DOMPurify.sanitize(html);
            handleChangeArticleContent(sanitizedHtml)
        }
        }  
    };


    return (
        <div className="main">
            <section>
                <ReactQuill modules={modules} ref={quillRef} theme="snow" onChange={handleChange} />
            </section>
            {/* <div style={{
                whiteSpace: "pre-wrap", // Ensures spaces, tabs, and line breaks are preserved
                marginTop: "20px",
        }} dangerouslySetInnerHTML={{ __html:editorHtml}} /> */}

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