package com.example.demo.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FotoImovelDTO {

    private Integer id; 
    private String nomeArquivo; 
    private String caminho;
    private Boolean capa;
    private Integer ordem;
    private Integer imovel_id; //chave estrangeira para o imóvel

    public FotoImovelDTO() {
    }
    
    public FotoImovelDTO(Integer id, String nomeArquivo, String caminho, Boolean capa, Integer ordem, Integer imovel_id) {
        this.id = id;
        this.nomeArquivo = nomeArquivo;
        this.caminho = caminho;
        this. capa = capa;
        this.ordem = ordem;
        this.imovel_id = imovel_id;
    }



}
