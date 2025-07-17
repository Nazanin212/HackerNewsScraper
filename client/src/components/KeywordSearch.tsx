import React, { useState, ChangeEvent } from 'react';

const KeywordSearch: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = () => {
    const mockData: string[] = [
      'React', 'Dashboard', 'Tab', 'Search', 'Top Story', 'Testing', 'Keyword'
    ];

    const filtered = mockData.filter(item =>
      item.toLowerCase().includes(keyword.toLowerCase())
    );

    setResults(filtered);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div>
      <h2>Keyword Search</h2>
      <input
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder="Enter keyword..."
        style={{
          padding: '10px',
          width: '80%',
          marginBottom: '10px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />
      <br />
      <button onClick={handleSearch} className="action-btn">
        Search
      </button>
      <ul style={{ marginTop: '15px' }}>
        {results.length > 0
          ? results.map((r, i) => <li key={i}>🔍 {r}</li>)
          : <li>No results found.</li>}
      </ul>
    </div>
  );
};

export default KeywordSearch;
