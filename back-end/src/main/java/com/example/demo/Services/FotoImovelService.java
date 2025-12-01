package com.example.demo.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.Models.FotoImovelModel;
import com.example.demo.Repositories.FotoImovelRepository;
import com.example.demo.dtos.FotoImovelDTO;

@Service
public class FotoImovelService {
    

    @Autowired
    private FotoImovelRepository repository;
        
    public List<FotoImovelModel> getAll() {
        List<FotoImovelModel> list = repository.findAll();
        return list;
    } 

    public Page<FotoImovelModel> getAll(Pageable pageable) {
        Page<FotoImovelModel> list = repository.findAll(pageable);
        return list;
    }

    public FotoImovelModel find(Integer id) {
        Optional<FotoImovelModel> model = repository.findById(id);
        return model.orElse(null);
    }

    public FotoImovelModel insert(FotoImovelDTO dto){
        FotoImovelModel model = new FotoImovelModel(null, null, null, null, null);
        model.setNomeArquivo(dto.getNomeArquivo());
        model.setCaminho(dto.getCaminho());
        model.setCapa(dto.getCapa());
        model.setOrdem(dto.getOrdem());
        return repository.save(model);
    }
 
    public FotoImovelModel update(FotoImovelModel model) {
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
