import { create } from 'zustand';
import { fetchPeopleData, fetchAllPeopleData } from '../api/api';

const usePeopleStore = create((set, get) => ({
  people: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  activeFilters: [],
  activeSorts: [],
  
  loadPeopleData: async (params = {}) => {
    set({ loading: true, error: null });
    
    try {
      
      const { 
        page = get().currentPage, 
        pageSize = get().pageSize,
        filters = get().activeFilters,
        sorts = get().activeSorts
      } = params;
      
    
      
      const result = await fetchPeopleData({
        page,
        pageSize,
        filters,
        sorts
      });
      
      console.log("People data loaded:", result);
      
      if (result.error) {
        set({ error: result.error, loading: false });
        return result;
      }
      
      set({ 
        people: result.data || [],
        totalCount: result.totalCount || 0,
        currentPage: page,
        pageSize: pageSize,
        loading: false
      });
      
      return result;
    } catch (error) {
      console.error("Error in loadPeopleData:", error);
      set({ 
        error: error.message || "Failed to load data", 
        loading: false 
      });
      
      return {
        data: [],
        totalCount: 0,
        error: error.message
      };
    }
  },
  
 
  fetchAllPeople: async () => {
    set({ loading: true, error: null });
    
    try {
   
      
      const result = await fetchAllPeopleData();
      
      console.log("All people data fetched:", result);
      
      if (result.error) {
        set({ error: result.error, loading: false });
        return result;
      }
      
      set({ 
        people: result.data || [],
        totalCount: result.totalCount || 0,
        loading: false,
        pageSize: result.data.length || 10
      });
      
      return result;
    } catch (error) {
      console.error("Error in fetchAllPeople:", error);
      set({ 
        error: error.message || "Failed to fetch all data", 
        loading: false 
      });
      
      return {
        data: [],
        totalCount: 0,
        error: error.message
      };
    }
  },
  

  setPage: (page) => {
    set({ currentPage: page });
    get().loadPeopleData({ page });
  },
  
  setPageSize: (pageSize) => {
    set({ pageSize, currentPage: 1 });
    get().loadPeopleData({ pageSize, page: 1 });
  },
  

  applyFilters: (filters) => {
    set({ activeFilters: filters, currentPage: 1 });
    get().loadPeopleData({ filters, page: 1 });
  },
  

  clearFilters: () => {
    set({ activeFilters: [], currentPage: 1 });
    get().loadPeopleData({ filters: [], page: 1 });
  },
  

  applySorts: (sorts) => {
    set({ activeSorts: sorts });
    get().loadPeopleData({ sorts });
  },
  

  clearSorts: () => {
    set({ activeSorts: [] });
    get().loadPeopleData({ sorts: [] });
  },
  

  navigatePage: (direction) => {
    const newPage = get().currentPage + direction;
    if (newPage < 1) return;
    
    set({ currentPage: newPage });
    get().loadPeopleData({ page: newPage });
  }
}));

export default usePeopleStore;
