package com.example.demo.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Models.BairroModel;

@Repository
public interface BairroRepository extends JpaRepository<BairroModel, Integer> {
}
