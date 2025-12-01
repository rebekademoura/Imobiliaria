package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Models.FotoImovelModel;
import com.example.demo.Services.FotoImovelService;
import com.example.demo.dtos.FotoImovelDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping(value = "/fotos")
public class FotoImovelController {

    @Autowired
    private FotoImovelService service;


    //deve ter todos os metodos basicos de CRUD: POST, GET, PUT, DELETE

    @GetMapping("/imovel/{id}") //fotos/imovel/id
    public List<FotoImovelModel> listarPorImovel(@PathVariable Integer id) { 
        //return service.listarPorImovel(id); 
        return null;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public String salvar(@RequestPart("arquivo") MultipartFile arquivo, @RequestPart("dados") String dados) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                // 1 - converter a String (JSON) em DTO
                FotoImovelDTO dto = mapper.readValue(dados, FotoImovelDTO.class);

                // 2 - salvar o arquivo na pasta de destino
                String caminho = "C:\\Users\\rebek\\OneDrive\\Documentos\\Programação Web IV\\Projeto de Imobiliaria\\demo\\src\\"
                    + arquivo.getOriginalFilename();
                arquivo.transferTo(new java.io.File(caminho));

                // 3 - preencher o caminho no DTO (se você tiver o campo)
                dto.setCaminho(caminho);

                // 4 - salvar o modelo no banco
                FotoImovelModel salvo = service.insert(dto);

                // 5 - retornar mensagem feliz :)
                return "Arquivo salvo com sucesso: " + salvo.getCaminho();

            } catch (Exception e) {
                return "Erro ao salvar arquivo: " + e.getMessage();
        }
}




}
