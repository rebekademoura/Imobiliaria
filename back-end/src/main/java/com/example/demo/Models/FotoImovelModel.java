package com.example.demo.Models;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "fotos_imoveis")
@Getter
@Setter
public class FotoImovelModel implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome_arquivo")
    private String nomeArquivo;

    @Column(name = "caminho")
    private String caminho;

    @Column(name = "capa")
    private Boolean capa;

    @Column(name = "ordem")
    private Integer ordem;

    public FotoImovelModel() {} // ✅ necessário pelo JPA

    public FotoImovelModel(Integer id, String nomeArquivo, String caminho, Boolean capa, Integer ordem){
        this.id = id;
        this.nomeArquivo = nomeArquivo;
        this.caminho = caminho;
        this.capa = capa;
        this.ordem = ordem;
    }

    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imovel_id")
    private ImovelModel imovel;

    @Override
    public int hashCode() {
        final int prime = 31; int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;
        FotoImovelModel other = (FotoImovelModel) obj;
        if (id == null) { if (other.id != null) return false; }
        else if (!id.equals(other.id)) return false;
        return true;
    }
}
