import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'https://services.odata.org/TripPinRESTierService/(S(zmvnmwolerxlglf1jhdcrgek))';
const PEOPLE_ENDPOINT = '/People';
const DEFAULT_PAGE_SIZE = 10;

const usePeopleStore = create((set, get) => ({
  people: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,
  activeFilters: [],
  activeSorts: [],
  
  // Fetch all people data
  fetchAllPeople: async () => {
    set({ loading: true, error: null });
    try {
      let url = `${API_BASE_URL}${PEOPLE_ENDPOINT}?$count=true`;
      url += '&$select=UserName,FirstName,LastName,MiddleName,Gender,Age';
      
      const response = await axios.get(url);
      const data = response.data;
      
      set({ 
        people: data.value,
        totalCount: data['@odata.count'] || data.value.length,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching all people data:', error);
    }
  },
  
  // Load people data with pagination, filtering, and sorting
  loadPeopleData: async () => {
    const { currentPage, pageSize, activeFilters, activeSorts } = get();
    set({ loading: true, error: null });
    
    try {
      let url = `${API_BASE_URL}${PEOPLE_ENDPOINT}?$count=true&$top=${pageSize}&$skip=${(currentPage - 1) * pageSize}`;
      url += '&$select=UserName,FirstName,LastName,MiddleName,Gender,Age';
      
      // Add filters
      if (activeFilters.length > 0) {
        const filterQueries = activeFilters.map(filter => {
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
      
      // Add sorts
      if (activeSorts.length > 0) {
        const sortQueries = activeSorts.map(sort => {
          return `${sort.field} ${sort.direction}`;
        });
        
        if (sortQueries.length > 0) {
          url += `&$orderby=${sortQueries.join(',')}`;
        }
      }
      
      console.log("Fetching data from:", url);
      
      const response = await axios.get(url);
      const data = response.data;
      
      set({ 
        people: data.value,
        totalCount: data['@odata.count'] || get().totalCount,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching people data:', error);
    }
  },
  
  // Navigation
  navigatePage: (direction) => {
    const { currentPage, totalCount, pageSize } = get();
    const newPage = currentPage + direction;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    if (newPage < 1 || (totalPages > 0 && newPage > totalPages)) {
      return;
    }
    
    set({ currentPage: newPage });
    get().loadPeopleData();
  },
  
  // Set page size
  setPageSize: (size) => {
    if (size > 0) {
      set({ pageSize: size, currentPage: 1 });
      get().loadPeopleData();
    }
  },
  
  // Apply filters
  applyFilters: (filters) => {
    set({ activeFilters: filters, currentPage: 1 });
    get().loadPeopleData();
  },
  
  // Clear filters
  clearFilters: () => {
    set({ activeFilters: [] });
    get().loadPeopleData();
  },
  
  // Apply sorts
  applySorts: (sorts) => {
    set({ activeSorts: sorts });
    get().loadPeopleData();
  },
  
  // Clear sorts
  clearSorts: () => {
    set({ activeSorts: [] });
    get().loadPeopleData();
  }
}));

export default usePeopleStore;
