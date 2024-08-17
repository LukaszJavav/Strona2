package com.example.Diet;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietRepository extends CrudRepository<Diet,Long> {
}
