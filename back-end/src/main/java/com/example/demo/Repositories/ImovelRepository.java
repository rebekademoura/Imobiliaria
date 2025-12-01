package com.example.demo.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Models.ImovelModel;

public interface  ImovelRepository extends JpaRepository<ImovelModel, Integer>{
    
}