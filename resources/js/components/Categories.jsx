import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch categories. ' + (err.response ? err.response.data.message : err.message));
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="text-center">Loading categories...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            <h1>Product Categories</h1>
            <ul className="list-group">
                {categories.map(category => (
                    <li className="list-group-item" key={category.id}>
                        <h5>{category.name}</h5>
                        <p>{category.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categories;