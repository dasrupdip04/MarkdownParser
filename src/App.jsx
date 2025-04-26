import React, { useState } from 'react';
import './index.css';

function App() {
  const initialText = `Try this
# h1
## h2
### h3
#### h4
##### h5
###### h6

**bold text**
*italics*

## Some Unordered List:
- Item 1
- Item 2
- Item 3 
  - Sub Item 1
  - Sub Item 2
  - Sub Item 3

## Some Ordered List:
1. Item 1
2. Item 2
3. Item 3`;

  const [markdownText, setMarkdownText] = useState(initialText);

  const handleTextChange = (e) => {
    setMarkdownText(e.target.value);
  };

  const handleClearText = () => {
    setMarkdownText('');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(markdownText)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy:", err);
      });
  };

  const handleDownloadText = () => {
    const filename = "markdown.txt";
    const blob = new Blob([markdownText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseMarkdown = (text) => {
    const lines = text.split('\n');
    const result = [];
    
    let inUnorderedList = false;
    let inOrderedList = false;
    let currentList = [];
    let currentListType = null;
    let currentIndentLevel = 0;

    const finishList = () => {
      if (currentListType && currentList.length > 0) {
        if (currentListType === 'ul') {
          result.push(<ul key={`ul-${result.length}`} className="list-disc ml-5">{currentList}</ul>);
        } else {
          result.push(<ol key={`ol-${result.length}`} className="list-decimal ml-5">{currentList}</ol>);
        }
        currentList = [];
        currentListType = null;
      }
      inUnorderedList = false;
      inOrderedList = false;
    };

    lines.forEach((line, index) => {
      if (line.trim() === '') {
        if (inUnorderedList || inOrderedList) {
          finishList();
        }
        result.push(<p key={`empty-${index}`}>&nbsp;</p>);
        return;
      }

      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        if (inUnorderedList || inOrderedList) {
          finishList();
        }

        const level = headingMatch[1].length;
        const text = headingMatch[2];
        
        const sizes = {
          1: 'text-2xl',
          2: 'text-xl',
          3: 'text-lg',
          4: 'text-base',
          5: 'text-sm',
          6: 'text-xs'
        };
        
        result.push(
          <p 
            key={`heading-${index}`} 
            className={`font-bold ${sizes[level]} mt-2 mb-1`}
          >
            {text}
          </p>
        );
        return;
      }

      let content = line;
      if (content.includes('**')) {
        const parts = content.split('**');
        if (parts.length >= 3) {
          const elements = [];
          
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
              elements.push(parts[i]);
            } else {
              elements.push(<strong key={`bold-${index}-${i}`}>{parts[i]}</strong>);
            }
          }
          
          content = '';
          const wrappedElements = <p key={`formatted-${index}`}>{elements}</p>;
          
          if (inUnorderedList || inOrderedList) {
            currentList.push(<li key={`list-item-${index}`}>{elements}</li>);
          } else {
            result.push(wrappedElements);
          }
          return;
        }
      }

      if (content.startsWith('*') && content.endsWith('*') && !content.startsWith('**')) {
        const text = content.slice(1, -1);
        
        if (inUnorderedList || inOrderedList) {
          currentList.push(<li key={`list-item-${index}`}><em>{text}</em></li>);
        } else {
          result.push(<p key={`italic-${index}`}><em>{text}</em></p>);
        }
        return;
      }

      const unorderedMatch = line.match(/^(\s*)-\s+(.+)$/);
      if (unorderedMatch) {
        const indentation = unorderedMatch[1].length;
        const text = unorderedMatch[2];
        
        if (!inUnorderedList || indentation !== currentIndentLevel) {
          if (inOrderedList) {
            finishList();
          }
          
          if (!inUnorderedList) {
            inUnorderedList = true;
            currentListType = 'ul';
            currentIndentLevel = indentation;
          }
        }
        
        currentList.push(<li key={`list-item-${index}`}>{text}</li>);
        return;
      }

      const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
      if (orderedMatch) {
        const indentation = orderedMatch[1].length;
        const text = orderedMatch[3];

        if (!inOrderedList || indentation !== currentIndentLevel) {
          if (inUnorderedList) {
            finishList();
          }
          
          if (!inOrderedList) {
            inOrderedList = true;
            currentListType = 'ol';
            currentIndentLevel = indentation;
          }
        }
        
        currentList.push(<li key={`list-item-${index}`}>{text}</li>);
        return;
      }

      if (inUnorderedList || inOrderedList) {
        finishList();
      }
      
      result.push(<p key={`paragraph-${index}`}>{content}</p>);
    });

    if (inUnorderedList || inOrderedList) {
      finishList();
    }

    return result;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center font-['Poppins']">
      <header className="w-full text-center py-4 md:py-5 bg-gray-800 shadow-md fixed top-0 z-10">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-orange-500">Markdown Parser</h1>
      </header>
      
      <div className="w-full max-w-7xl px-4 mt-16 md:mt-20 flex flex-col lg:flex-row lg:gap-6 items-stretch">
        <div className="w-full lg:w-1/2 bg-gray-800 p-4 md:p-5 rounded-lg shadow-lg mb-5 lg:mb-0 transition-transform duration-300 hover:translate-y-[-3px]">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-lg md:text-xl font-medium">Markdown Editor</h2>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="flex-1 sm:flex-none bg-orange-500 text-white py-2 px-3 md:px-4 text-sm md:text-base font-medium rounded-md transition-all duration-300 hover:bg-orange-600 active:scale-95"
                  onClick={handleDownloadText}
                >
                  Download
                </button>
                <button 
                  className="flex-1 sm:flex-none bg-orange-500 text-white py-2 px-3 md:px-4 text-sm md:text-base font-medium rounded-md transition-all duration-300 hover:bg-orange-600 active:scale-95"
                  onClick={handleClearText}
                >
                  Clear
                </button>
                <button 
                  className="flex-1 sm:flex-none bg-orange-500 text-white py-2 px-3 md:px-4 text-sm md:text-base font-medium rounded-md transition-all duration-300 hover:bg-orange-600 active:scale-95"
                  onClick={handleCopyText}
                >
                  Copy
                </button>
              </div>
            </div>
            
            <textarea 
              className="w-full h-[300px] lg:h-[calc(100vh-220px)] p-3 md:p-4 border-2 border-gray-600 rounded-lg bg-gray-900 text-gray-100 text-sm md:text-base resize-none outline-none transition-all duration-300 focus:border-orange-500"
              value={markdownText}
              onChange={handleTextChange}
              placeholder="Enter markdown text here..."
            />
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 bg-gray-800 p-4 md:p-5 rounded-lg shadow-lg transition-transform duration-300 hover:translate-y-[-3px]">
          <h2 className="text-lg md:text-xl font-medium mb-3 md:mb-4">Preview</h2>
          <div className="p-4 md:p-6 lg:p-8 min-h-[300px] lg:h-[calc(100vh-220px)] overflow-y-auto bg-gray-900 border-2 border-gray-600 rounded-lg text-gray-100 text-sm md:text-base">
            {parseMarkdown(markdownText)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;