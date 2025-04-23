
interface TemplateSelectorProps {
  selectedTemplate: string | null;
  setSelectedTemplate: (val: string) => void;
}

const TEMPLATES = [
  { label: "Modern CV", value: "cv" },
  { label: "Cover Letter", value: "cover_letter" }
];

const TemplateSelector = ({ selectedTemplate, setSelectedTemplate }: TemplateSelectorProps) => (
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium">Choose Document Type</label>
    <div className="flex gap-4">
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.value}
          type="button"
          className={`px-3 py-2 rounded border ${
            selectedTemplate === tpl.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-gray-200"
          }`}
          onClick={() => setSelectedTemplate(tpl.value)}
        >
          {tpl.label}
        </button>
      ))}
    </div>
  </div>
);

export default TemplateSelector;
