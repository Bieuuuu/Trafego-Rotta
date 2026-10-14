package com.rotametric.app.core.parser

import android.view.accessibility.AccessibilityNodeInfo
import com.rotametric.app.core.model.NodeSnapshot

/**
 * Converte AccessibilityNodeInfo em NodeSnapshot imutável.
 * Limita profundidade e quantidade de nós para evitar custo excessivo.
 * Filtra classes de entrada de texto (EditText) para não ler campos editáveis.
 */
object AccessibilityNodeReader {
    private const val MAX_DEPTH = 18
    private const val MAX_NODES = 400

    fun snapshot(root: AccessibilityNodeInfo?): NodeSnapshot? {
        root ?: return null
        var count = 0
        fun walk(node: AccessibilityNodeInfo, depth: Int): NodeSnapshot? {
            if (depth > MAX_DEPTH || count >= MAX_NODES) return null
            count++
            val className = node.className?.toString()
            val isEditable = node.isEditable || className?.contains("EditText") == true
            val text = if (isEditable || node.isPassword) null else node.text?.toString()
            val desc = if (isEditable) null else node.contentDescription?.toString()
            val children = ArrayList<NodeSnapshot>(node.childCount)
            for (i in 0 until node.childCount) {
                val child = node.getChild(i) ?: continue
                walk(child, depth + 1)?.let(children::add)
                child.recycle()
            }
            return NodeSnapshot(
                text = text,
                contentDescription = desc,
                viewId = node.viewIdResourceName,
                className = className,
                children = children
            )
        }
        return walk(root, 0)
    }
}