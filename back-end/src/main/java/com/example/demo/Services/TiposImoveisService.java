package com.example.demo.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.Models.TiposImoveisModel;
import com.example.demo.Repositories.TiposImoveisRepository;

@Service
public class TiposImoveisService {
    

    @Autowired
    private TiposImoveisRepository repository;
        
    public List<TiposImoveisModel> getAll() {
        List<TiposImoveisModel> list = repository.findAll();
        return list;
    } 

    public Page<TiposImoveisModel> getAll(Pageable pageable) {
        Page<TiposImoveisModel> list = repository.findAll(pageable);
        return list;
    }

    public TiposImoveisModel find(Integer id) {
        Optional<TiposImoveisModel> model = repository.findById(id);
        return model.orElse(null);
    }

    public TiposImoveisModel insert(TiposImoveisModel model) {
        return repository.save(model);
    }
 
    public TiposImoveisModel update(TiposImoveisModel model) {
        try {
            if(find(model.getId())!=null){
                return repository.save(model);
            }
            return null;
        } catch (Exception e) {
            return null;
        }

    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

}
