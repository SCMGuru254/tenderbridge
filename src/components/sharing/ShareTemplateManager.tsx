import React, { useState, useEffect } from 'react';
import { useShareTemplates } from '../hooks/useSharing';
import type { ShareTemplate } from '../types/sharing';

interface ShareTemplateManagerProps {
  type?: ShareTemplate['templateType'];
}

export const ShareTemplateManager: React.FC<ShareTemplateManagerProps> = ({ type }) => {
  const [templates, setTemplates] = useState<ShareTemplate[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const { createTemplate, getTemplates, loading, error } = useShareTemplates();

  useEffect(() => {
    loadTemplates();
  }, [type]);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates(type);
      setTemplates(data);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTemplate({
        templateType: type || 'general',
        title,
        content,
        variables
      });
      setTitle('');
      setContent('');
      setVariables([]);
      loadTemplates();
    } catch (err) {
      console.error('Error creating template:', err);
    }
  };

  const addVariable = () => {
    setVariables([...variables, '']);
  };

  const updateVariable = (index: number, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = value;
    setVariables(newVariables);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Template Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Template Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Template Variables
          </label>
          {variables.map((variable, index) => (
            <input
              key={index}
              type="text"
              value={variable}
              onChange={(e) => updateVariable(index, e.target.value)}
              placeholder={`Variable ${index + 1}`}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          ))}
          <button
            type="button"
            onClick={addVariable}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Variable
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Template'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Existing Templates</h3>
        <div className="mt-4 space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h4 className="text-md font-medium">{template.title}</h4>
              <p className="mt-2 text-gray-600">{template.content}</p>
              {template.variables.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Variables: {template.variables.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareTemplateManager;
