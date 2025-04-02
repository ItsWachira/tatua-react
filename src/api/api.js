import axios from 'axios';
const API_BASE_URL = 'https://services.odata.org/TripPinRESTierService/(S(1lkvojlyg4qer3lrevgbjtyo))';
const PEOPLE_ENDPOINT = '/People';


export const fetchPeopleData = async (params = {}) => {
  const { 
    page = 1, 
    pageSize = 10, 
    filters = [], 
    sorts = [] 
  } = params;
  
  try {
    let url = `${API_BASE_URL}${PEOPLE_ENDPOINT}?$count=true&$top=${pageSize}&$skip=${(page - 1) * pageSize}`;
    url += '&$select=UserName,FirstName,LastName,MiddleName,Gender,Age';
    
 
    if (filters.length > 0) {
      const filterQueries = filters.map(filter => {
        const { field, operator, value } = filter;
        
        switch (operator) {
          case 'eq':
            return `${field} eq '${value}'`;
          case 'contains':
            return `contains(${field}, '${value}')`;
          case 'startswith':
            return `startswith(${field}, '${value}')`;
          case 'endswith':
            return `endswith(${field}, '${value}')`;
          case 'gt':
            if (field === 'Age') {
              return `${field} gt ${value}`;
            }
            return `${field} gt '${value}'`;
          case 'lt':
            if (field === 'Age') {
              return `${field} lt ${value}`;
            }
            return `${field} lt '${value}'`;
          default:
            return '';
        }
      }).filter(query => query !== '');
      
      if (filterQueries.length > 0) {
        url += `&$filter=${filterQueries.join(' and ')}`;
      }
    }
    
   
    if (sorts.length > 0) {
      const sortQueries = sorts.map(sort => {
        return `${sort.field} ${sort.direction}`;
      });
      
      if (sortQueries.length > 0) {
        url += `&$orderby=${sortQueries.join(',')}`;
      }
    }
    
    console.log("Fetching data from:", url);
    
    const response = await axios.get(url, {
      timeout: 10000 
    });
    
    console.log("API response:", response.data);
    
   
    if (!response.data || !response.data.value) {
      console.error("Invalid API response format:", response.data);
      return {
        data: [],
        totalCount: 0,
        error: "Invalid API response format"
      };
    }
    
    return {
      data: response.data.value,
      totalCount: response.data['@odata.count'] || response.data.value.length,
      error: null
    };
  } catch (error) {
    console.error('Error fetching people data:', error);

  }
};

// Function to fetch all people data without pagination
export const fetchAllPeopleData = async () => {
  try {
   
    let url = `${API_BASE_URL}${PEOPLE_ENDPOINT}?$count=true`;
    url += '&$select=UserName,FirstName,LastName,MiddleName,Gender,Age';
    
    console.log("Fetching ALL people data from:", url);
    
    const response = await axios.get(url, {
      timeout: 10000 
    });
    
    if (!response.data || !response.data.value) {
      console.error("Invalid API response format:", response.data);
      return {
        data: [],
        totalCount: 0,
        error: "Invalid API response format"
      };
    }
    
    return {
      data: response.data.value,
      totalCount: response.data['@odata.count'] || response.data.value.length,
      error: null
    };
  } catch (error) {
    console.error('Error fetching all people data:', error);
    return {
      data: [],
      totalCount: 0,
      error: error.message
    };
  }
};
