import  { useRef, useMemo, useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import DOMPurify from 'dompurify';
import '../ql-config.scss'
import axios from 'axios';
import { apiAksimBaseUrl } from '../main';

interface Props{
    handleChangeArticleContent: (html: string) => void,
    initialContent?:string
}

function ArticleCreator({handleChangeArticleContent, initialContent}:Props){

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
              const response = await axios.post(`${apiAksimBaseUrl}/user/add-image-to-article`, formData, {
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

    useEffect(() => {
      // Set the initial content when the component mounts or when initialContent changes
      if (quillRef.current && initialContent) {
        const editor = quillRef.current.getEditor();
        editor.clipboard.dangerouslyPasteHTML(initialContent);
      }
    }, [initialContent]);

    return (
        <div className="main">
            <section>
                <ReactQuill modules={modules} ref={quillRef} theme="snow" onChange={handleChange} />
            </section>
        </div>
    );

}

export default ArticleCreator;