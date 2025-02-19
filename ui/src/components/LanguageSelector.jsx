function LanguageSelector({ label, value, onChange }) {
  return (
    <select
      className="select w-40"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{label}</option>
      <option value="arabic">Arabic</option>
      <option value="english">English</option>
      <option value="spanish">Spanish</option>
      <option value="french">French</option>
      <option value="german">German</option>
      <option value="chinese">Chinese</option>
      <option value="russian">Russian</option>
      <option value="ukrainian">Ukrainian</option>
      <option value="japanese">Japanese</option>
    </select>
  );
}

export default LanguageSelector;
